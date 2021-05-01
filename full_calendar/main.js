(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.FullCalendar = {}));
}(this, function (exports, core) {

    function memoize(workerFunc) {
        var args;
        var res;
        return function () {
            if (!args || !isArraysEqual(args, arguments)) {
                args = arguments;
                res = workerFunc.apply(this, arguments);
            }
            return res;
        };
    }

    function buildComponentContext$1(theme, dateEnv, options) {
        return new ComponentContext(this, theme, dateEnv, options, null);
    }

    var Calendar = /** @class */ (function () {
        function Calendar(el, overrides) {
            var _this = this;
            this.buildComponentContext = memoize(buildComponentContext$1);
            this.parseRawLocales = memoize(parseRawLocales);
            this.buildLocale = memoize(buildLocale);
            this.buildDateEnv = memoize(buildDateEnv);
            this.buildTheme = memoize(buildTheme);
            this.buildEventUiSingleBase = memoize(this._buildEventUiSingleBase);
            this.buildSelectionConfig = memoize(this._buildSelectionConfig);
            this.buildEventUiBySource = memoizeOutput(buildEventUiBySource, isPropsEqual);
            this.buildEventUiBases = memoize(buildEventUiBases);
            this.interactionsStore = {};
            this.actionQueue = [];
            this.isReducing = false;
            // isDisplaying: boolean = false // installed in DOM? accepting renders?
            this.needsRerender = false; // needs a render?
            this.isRendering = false; // currently in the executeRender function?
            this.renderingPauseDepth = 0;
            this.buildDelayedRerender = memoize(buildDelayedRerender);
            this.afterSizingTriggers = {};
            this.isViewUpdated = false;
            this.isDatesUpdated = false;
            this.isEventsUpdated = false;
            this.el = el;
            this.optionsManager = new OptionsManager(overrides || {});
            this.pluginSystem = new PluginSystem();
            // only do once. don't do in handleOptions. because can't remove plugins
            this.addPluginInputs(this.optionsManager.computed.plugins || []);
            this.handleOptions(this.optionsManager.computed);
            this.publiclyTrigger('_init'); // for tests
            this.hydrate();
            this.calendarInteractions = this.pluginSystem.hooks.calendarInteractions
                .map(function (calendarInteractionClass) {
                return new calendarInteractionClass(_this);
            });
        }
        Calendar.prototype.addPluginInputs = function (pluginInputs) {
            var pluginDefs = refinePluginDefs(pluginInputs);
            for (var _i = 0, pluginDefs_1 = pluginDefs; _i < pluginDefs_1.length; _i++) {
                var pluginDef = pluginDefs_1[_i];
                this.pluginSystem.add(pluginDef);
            }
        };
        Object.defineProperty(Calendar.prototype, "view", {
            // public API
            get: function () {
                return this.component ? this.component.view : null;
            },
            enumerable: true,
            configurable: true
        });
        // Public API for rendering
        // -----------------------------------------------------------------------------------------------------------------
        //#002:그려주는부분인듯
        Calendar.prototype.render = function () {
            if (!this.component) {
                this.component = new CalendarComponent(this.el);
                this.renderableEventStore = createEmptyEventStore();
                this.bindHandlers();
                this.executeRender();
            }
            else {
                this.requestRerender();
            }
        };
        Calendar.prototype.destroy = function () {
            if (this.component) {
                this.unbindHandlers();
                this.component.destroy(); // don't null-out. in case API needs access
                this.component = null; // umm ???
                for (var _i = 0, _a = this.calendarInteractions; _i < _a.length; _i++) {
                    var interaction = _a[_i];
                    interaction.destroy();
                }
                this.publiclyTrigger('_destroyed');
            }
        };
        // Handlers
        // -----------------------------------------------------------------------------------------------------------------
        Calendar.prototype.bindHandlers = function () {
            var _this = this;
            // event delegation for nav links
            this.removeNavLinkListener = listenBySelector(this.el, 'click', 'a[data-goto]', function (ev, anchorEl) {
                var gotoOptions = anchorEl.getAttribute('data-goto');
                gotoOptions = gotoOptions ? JSON.parse(gotoOptions) : {};
                var dateEnv = _this.dateEnv;
                var dateMarker = dateEnv.createMarker(gotoOptions.date);
                var viewType = gotoOptions.type;
                // property like "navLinkDayClick". might be a string or a function
                var customAction = _this.viewOpt('navLink' + capitaliseFirstLetter(viewType) + 'Click');
                if (typeof customAction === 'function') {
                    customAction(dateEnv.toDate(dateMarker), ev);
                }
                else {
                    if (typeof customAction === 'string') {
                        viewType = customAction;
                    }
                    _this.zoomTo(dateMarker, viewType);
                }
            });
            if (this.opt('handleWindowResize')) {
                window.addEventListener('resize', this.windowResizeProxy = debounce(// prevents rapid calls
                this.windowResize.bind(this), this.opt('windowResizeDelay')));
            }
        };
        Calendar.prototype.unbindHandlers = function () {
            this.removeNavLinkListener();
            if (this.windowResizeProxy) {
                window.removeEventListener('resize', this.windowResizeProxy);
                this.windowResizeProxy = null;
            }
        };
        // Dispatcher
        // -----------------------------------------------------------------------------------------------------------------
        Calendar.prototype.hydrate = function () {
            var _this = this;
            this.state = this.buildInitialState();
            var rawSources = this.opt('eventSources') || [];
            var singleRawSource = this.opt('events');
            var sources = []; // parsed
            if (singleRawSource) {
                rawSources.unshift(singleRawSource);
            }
            for (var _i = 0, rawSources_1 = rawSources; _i < rawSources_1.length; _i++) {
                var rawSource = rawSources_1[_i];
                var source = parseEventSource(rawSource, this);
                if (source) {
                    sources.push(source);
                }
            }
            this.batchRendering(function () {
                _this.dispatch({ type: 'INIT' }); // pass in sources here?
                _this.dispatch({ type: 'ADD_EVENT_SOURCES', sources: sources });
                _this.dispatch({
                    type: 'SET_VIEW_TYPE',
                    viewType: _this.opt('defaultView') || _this.pluginSystem.hooks.defaultView
                });
            });
        };
        Calendar.prototype.buildInitialState = function () {
            return {
                viewType: null,
                loadingLevel: 0,
                eventSourceLoadingLevel: 0,
                currentDate: this.getInitialDate(),
                dateProfile: null,
                eventSources: {},
                eventStore: createEmptyEventStore(),
                dateSelection: null,
                eventSelection: '',
                eventDrag: null,
                eventResize: null
            };
        };
        Calendar.prototype.dispatch = function (action) {
            this.actionQueue.push(action);
            if (!this.isReducing) {
                this.isReducing = true;
                var oldState = this.state;
                while (this.actionQueue.length) {
                    this.state = this.reduce(this.state, this.actionQueue.shift(), this);
                }
                var newState = this.state;
                this.isReducing = false;
                if (!oldState.loadingLevel && newState.loadingLevel) {
                    this.publiclyTrigger('loading', [true]);
                }
                else if (oldState.loadingLevel && !newState.loadingLevel) {
                    this.publiclyTrigger('loading', [false]);
                }
                var view = this.component && this.component.view;
                if (oldState.eventStore !== newState.eventStore) {
                    if (oldState.eventStore) {
                        this.isEventsUpdated = true;
                    }
                }
                if (oldState.dateProfile !== newState.dateProfile) {
                    if (oldState.dateProfile && view) { // why would view be null!?
                        this.publiclyTrigger('datesDestroy', [
                            {
                                view: view,
                                el: view.el
                            }
                        ]);
                    }
                    this.isDatesUpdated = true;
                }
                if (oldState.viewType !== newState.viewType) {
                    if (oldState.viewType && view) { // why would view be null!?
                        this.publiclyTrigger('viewSkeletonDestroy', [
                            {
                                view: view,
                                el: view.el
                            }
                        ]);
                    }
                    this.isViewUpdated = true;
                }
                this.requestRerender();
            }
        };
        Calendar.prototype.reduce = function (state, action, calendar) {
            return reduce(state, action, calendar);
        };
        // Render Queue
        // -----------------------------------------------------------------------------------------------------------------
        Calendar.prototype.requestRerender = function () {
            this.needsRerender = true;
            this.delayedRerender(); // will call a debounced-version of tryRerender
        };
        Calendar.prototype.tryRerender = function () {
            if (this.component && // must be accepting renders
                this.needsRerender && // indicates that a rerender was requested
                !this.renderingPauseDepth && // not paused
                !this.isRendering // not currently in the render loop
            ) {
                this.executeRender();
            }
        };
        Calendar.prototype.batchRendering = function (func) {
            this.renderingPauseDepth++;
            func();
            this.renderingPauseDepth--;
            if (this.needsRerender) {
                this.requestRerender();
            }
        };
        // Rendering
        // -----------------------------------------------------------------------------------------------------------------
        Calendar.prototype.executeRender = function () {
            // clear these BEFORE the render so that new values will accumulate during render
            this.needsRerender = false;
            this.isRendering = true;
            this.renderComponent();
            this.isRendering = false;
            // received a rerender request while rendering
            if (this.needsRerender) {
                this.delayedRerender();
            }
        };
        /*
        don't call this directly. use executeRender instead
        */
        Calendar.prototype.renderComponent = function () {
            var _a = this, state = _a.state, component = _a.component;
            var viewType = state.viewType;
            var viewSpec = this.viewSpecs[viewType];
            if (!viewSpec) {
                throw new Error("View type \"" + viewType + "\" is not valid");
            }
            // if event sources are still loading and progressive rendering hasn't been enabled,
            // keep rendering the last fully loaded set of events
            var renderableEventStore = this.renderableEventStore =
                (state.eventSourceLoadingLevel && !this.opt('progressiveEventRendering')) ?
                    this.renderableEventStore :
                    state.eventStore;
            var eventUiSingleBase = this.buildEventUiSingleBase(viewSpec.options);
            var eventUiBySource = this.buildEventUiBySource(state.eventSources);
            var eventUiBases = this.eventUiBases = this.buildEventUiBases(renderableEventStore.defs, eventUiSingleBase, eventUiBySource);
            component.receiveProps(
                __assign(
                    {}, 
                    state, 
                    { viewSpec: viewSpec, dateProfileGenerator: this.dateProfileGenerators[viewType], dateProfile: state.dateProfile, eventStore: renderableEventStore, eventUiBases: eventUiBases, dateSelection: state.dateSelection, eventSelection: state.eventSelection, eventDrag: state.eventDrag, eventResize: state.eventResize }
                )
                , this.buildComponentContext(this.theme, this.dateEnv, this.optionsManager.computed)
            );
            if (this.isViewUpdated) {
                this.isViewUpdated = false;
                this.publiclyTrigger('viewSkeletonRender', [
                    {
                        view: component.view,
                        el: component.view.el
                    }
                ]);
            }
            if (this.isDatesUpdated) {
                this.isDatesUpdated = false;
                this.publiclyTrigger('datesRender', [
                    {
                        view: component.view,
                        el: component.view.el
                    }
                ]);
            }
            if (this.isEventsUpdated) {
                this.isEventsUpdated = false;
            }
            this.releaseAfterSizingTriggers();
        };
        // Options
        // -----------------------------------------------------------------------------------------------------------------
        Calendar.prototype.setOption = function (name, val) {
            var _a;
            this.mutateOptions((_a = {}, _a[name] = val, _a), [], true);
        };
        Calendar.prototype.getOption = function (name) {
            return this.optionsManager.computed[name];
        };
        Calendar.prototype.opt = function (name) {
            return this.optionsManager.computed[name];
        };
        Calendar.prototype.viewOpt = function (name) {
            return this.viewOpts()[name];
        };
        Calendar.prototype.viewOpts = function () {
            return this.viewSpecs[this.state.viewType].options;
        };
        /*
        handles option changes (like a diff)
        */
        Calendar.prototype.mutateOptions = function (updates, removals, isDynamic, deepEqual) {
            var _this = this;
            var changeHandlers = this.pluginSystem.hooks.optionChangeHandlers;
            var normalUpdates = {};
            var specialUpdates = {};
            var oldDateEnv = this.dateEnv; // do this before handleOptions
            var isTimeZoneDirty = false;
            var isSizeDirty = false;
            var anyDifficultOptions = Boolean(removals.length);
            for (var name_1 in updates) {
                if (changeHandlers[name_1]) {
                    specialUpdates[name_1] = updates[name_1];
                }
                else {
                    normalUpdates[name_1] = updates[name_1];
                }
            }
            for (var name_2 in normalUpdates) {
                if (/^(height|contentHeight|aspectRatio)$/.test(name_2)) {
                    isSizeDirty = true;
                }
                else if (/^(defaultDate|defaultView)$/.test(name_2)) ;
                else {
                    anyDifficultOptions = true;
                    if (name_2 === 'timeZone') {
                        isTimeZoneDirty = true;
                    }
                }
            }
            this.optionsManager.mutate(normalUpdates, removals, isDynamic);
            if (anyDifficultOptions) {
                this.handleOptions(this.optionsManager.computed);
            }
            this.batchRendering(function () {
                if (anyDifficultOptions) {
                    if (isTimeZoneDirty) {
                        _this.dispatch({
                            type: 'CHANGE_TIMEZONE',
                            oldDateEnv: oldDateEnv
                        });
                    }
                    /* HACK
                    has the same effect as calling this.requestRerender()
                    but recomputes the state's dateProfile
                    */
                    _this.dispatch({
                        type: 'SET_VIEW_TYPE',
                        viewType: _this.state.viewType
                    });
                }
                else if (isSizeDirty) {
                    _this.updateSize();
                }
                // special updates
                if (deepEqual) {
                    for (var name_3 in specialUpdates) {
                        changeHandlers[name_3](specialUpdates[name_3], _this, deepEqual);
                    }
                }
            });
        };
        /*
        rebuilds things based off of a complete set of refined options
        */
        Calendar.prototype.handleOptions = function (options) {
            var _this = this;
            var pluginHooks = this.pluginSystem.hooks;
            this.defaultAllDayEventDuration = createDuration(options.defaultAllDayEventDuration);
            this.defaultTimedEventDuration = createDuration(options.defaultTimedEventDuration);
            this.delayedRerender = this.buildDelayedRerender(options.rerenderDelay);
            this.theme = this.buildTheme(options);
            var available = this.parseRawLocales(options.locales);
            this.availableRawLocales = available.map;
            var locale = this.buildLocale(options.locale || available.defaultCode, available.map);
            this.dateEnv = this.buildDateEnv(locale, options.timeZone, pluginHooks.namedTimeZonedImpl, options.firstDay, options.weekNumberCalculation, options.weekLabel, pluginHooks.cmdFormatter);
            this.selectionConfig = this.buildSelectionConfig(options); // needs dateEnv. do after :(
            // ineffecient to do every time?
            this.viewSpecs = buildViewSpecs(pluginHooks.views, this.optionsManager);
            // ineffecient to do every time?
            this.dateProfileGenerators = mapHash(this.viewSpecs, function (viewSpec) {
                return new viewSpec.class.prototype.dateProfileGeneratorClass(viewSpec, _this);
            });
        };
        Calendar.prototype.getAvailableLocaleCodes = function () {
            return Object.keys(this.availableRawLocales);
        };
        Calendar.prototype._buildSelectionConfig = function (rawOpts) {
            return processScopedUiProps('select', rawOpts, this);
        };
        Calendar.prototype._buildEventUiSingleBase = function (rawOpts) {
            if (rawOpts.editable) { // so 'editable' affected events
                rawOpts = __assign({}, rawOpts, { eventEditable: true });
            }
            return processScopedUiProps('event', rawOpts, this);
        };
        // Trigger
        // -----------------------------------------------------------------------------------------------------------------
        Calendar.prototype.hasPublicHandlers = function (name) {
            return this.hasHandlers(name) ||
                this.opt(name); // handler specified in options
        };
        Calendar.prototype.publiclyTrigger = function (name, args) {
            var optHandler = this.opt(name);
            this.triggerWith(name, this, args);
            if (optHandler) {
                return optHandler.apply(this, args);
            }
        };
        Calendar.prototype.publiclyTriggerAfterSizing = function (name, args) {
            var afterSizingTriggers = this.afterSizingTriggers;
            (afterSizingTriggers[name] || (afterSizingTriggers[name] = [])).push(args);
        };
        Calendar.prototype.releaseAfterSizingTriggers = function () {
            var afterSizingTriggers = this.afterSizingTriggers;
            for (var name_4 in afterSizingTriggers) {
                for (var _i = 0, _a = afterSizingTriggers[name_4]; _i < _a.length; _i++) {
                    var args = _a[_i];
                    this.publiclyTrigger(name_4, args);
                }
            }
            this.afterSizingTriggers = {};
        };
        // View
        // -----------------------------------------------------------------------------------------------------------------
        // Returns a boolean about whether the view is okay to instantiate at some point
        Calendar.prototype.isValidViewType = function (viewType) {
            return Boolean(this.viewSpecs[viewType]);
        };
        Calendar.prototype.changeView = function (viewType, dateOrRange) {
            var dateMarker = null;
            if (dateOrRange) {
                if (dateOrRange.start && dateOrRange.end) { // a range
                    this.optionsManager.mutate({ visibleRange: dateOrRange }, []); // will not rerender
                    this.handleOptions(this.optionsManager.computed); // ...but yuck
                }
                else { // a date
                    dateMarker = this.dateEnv.createMarker(dateOrRange); // just like gotoDate
                }
            }
            this.unselect();
            this.dispatch({
                type: 'SET_VIEW_TYPE',
                viewType: viewType,
                dateMarker: dateMarker
            });
        };
        // Forces navigation to a view for the given date.
        // `viewType` can be a specific view name or a generic one like "week" or "day".
        // needs to change
        Calendar.prototype.zoomTo = function (dateMarker, viewType) {
            var spec;
            viewType = viewType || 'day'; // day is default zoom
            spec = this.viewSpecs[viewType] ||
                this.getUnitViewSpec(viewType);
            this.unselect();
            if (spec) {
                this.dispatch({
                    type: 'SET_VIEW_TYPE',
                    viewType: spec.type,
                    dateMarker: dateMarker
                });
            }
            else {
                this.dispatch({
                    type: 'SET_DATE',
                    dateMarker: dateMarker
                });
            }
        };
        // Given a duration singular unit, like "week" or "day", finds a matching view spec.
        // Preference is given to views that have corresponding buttons.
        Calendar.prototype.getUnitViewSpec = function (unit) {
            var component = this.component;
            var viewTypes = [];
            var i;
            var spec;
            // put views that have buttons first. there will be duplicates, but oh
            if (component.header) {
                viewTypes.push.apply(viewTypes, component.header.viewsWithButtons);
            }
            if (component.footer) {
                viewTypes.push.apply(viewTypes, component.footer.viewsWithButtons);
            }
            for (var viewType in this.viewSpecs) {
                viewTypes.push(viewType);
            }
            for (i = 0; i < viewTypes.length; i++) {
                spec = this.viewSpecs[viewTypes[i]];
                if (spec) {
                    if (spec.singleUnit === unit) {
                        return spec;
                    }
                }
            }
        };
        // Current Date
        // -----------------------------------------------------------------------------------------------------------------
        Calendar.prototype.getInitialDate = function () {
            var defaultDateInput = this.opt('defaultDate');
            // compute the initial ambig-timezone date
            if (defaultDateInput != null) {
                return this.dateEnv.createMarker(defaultDateInput);
            }
            else {
                return this.getNow(); // getNow already returns unzoned
            }
        };
        Calendar.prototype.prev = function () {
            this.unselect();
            this.dispatch({ type: 'PREV' });
        };
        Calendar.prototype.next = function () {
            this.unselect();
            this.dispatch({ type: 'NEXT' });
        };
        Calendar.prototype.prevYear = function () {
            this.unselect();
            this.dispatch({
                type: 'SET_DATE',
                dateMarker: this.dateEnv.addYears(this.state.currentDate, -1)
            });
        };
        Calendar.prototype.nextYear = function () {
            this.unselect();
            this.dispatch({
                type: 'SET_DATE',
                dateMarker: this.dateEnv.addYears(this.state.currentDate, 1)
            });
        };
        Calendar.prototype.today = function () {
            this.unselect();
            this.dispatch({
                type: 'SET_DATE',
                dateMarker: this.getNow()
            });
        };
        Calendar.prototype.gotoDate = function (zonedDateInput) {
            this.unselect();
            this.dispatch({
                type: 'SET_DATE',
                dateMarker: this.dateEnv.createMarker(zonedDateInput)
            });
        };
        Calendar.prototype.incrementDate = function (deltaInput) {
            var delta = createDuration(deltaInput);
            if (delta) { // else, warn about invalid input?
                this.unselect();
                this.dispatch({
                    type: 'SET_DATE',
                    dateMarker: this.dateEnv.add(this.state.currentDate, delta)
                });
            }
        };
        // for external API
        Calendar.prototype.getDate = function () {
            return this.dateEnv.toDate(this.state.currentDate);
        };
        // Date Formatting Utils
        // -----------------------------------------------------------------------------------------------------------------
        Calendar.prototype.formatDate = function (d, formatter) {
            var dateEnv = this.dateEnv;
            return dateEnv.format(dateEnv.createMarker(d), createFormatter(formatter));
        };
        // `settings` is for formatter AND isEndExclusive
        Calendar.prototype.formatRange = function (d0, d1, settings) {
            var dateEnv = this.dateEnv;
            return dateEnv.formatRange(dateEnv.createMarker(d0), dateEnv.createMarker(d1), createFormatter(settings, this.opt('defaultRangeSeparator')), settings);
        };
        Calendar.prototype.formatIso = function (d, omitTime) {
            var dateEnv = this.dateEnv;
            return dateEnv.formatIso(dateEnv.createMarker(d), { omitTime: omitTime });
        };
        // Sizing
        // -----------------------------------------------------------------------------------------------------------------
        Calendar.prototype.windowResize = function (ev) {
            if (!this.isHandlingWindowResize &&
                this.component && // why?
                ev.target === window // not a jqui resize event
            ) {
                this.isHandlingWindowResize = true;
                this.updateSize();
                this.publiclyTrigger('windowResize', [this.view]);
                this.isHandlingWindowResize = false;
            }
        };
        Calendar.prototype.updateSize = function () {
            if (this.component) { // when?
                this.component.updateSize(true);
            }
        };
        // Component Registration
        // -----------------------------------------------------------------------------------------------------------------
        Calendar.prototype.registerInteractiveComponent = function (component, settingsInput) {
            var settings = parseInteractionSettings(component, settingsInput);
            var DEFAULT_INTERACTIONS = [
                EventClicking,
                EventHovering
            ];
            var interactionClasses = DEFAULT_INTERACTIONS.concat(this.pluginSystem.hooks.componentInteractions);
            var interactions = interactionClasses.map(function (interactionClass) {
                return new interactionClass(settings);
            });
            this.interactionsStore[component.uid] = interactions;
            interactionSettingsStore[component.uid] = settings;
        };
        Calendar.prototype.unregisterInteractiveComponent = function (component) {
            for (var _i = 0, _a = this.interactionsStore[component.uid]; _i < _a.length; _i++) {
                var listener = _a[_i];
                listener.destroy();
            }
            delete this.interactionsStore[component.uid];
            delete interactionSettingsStore[component.uid];
        };
        // Date Selection / Event Selection / DayClick
        // -----------------------------------------------------------------------------------------------------------------
        // this public method receives start/end dates in any format, with any timezone
        // NOTE: args were changed from v3
        Calendar.prototype.select = function (dateOrObj, endDate) {
            var selectionInput;
            if (endDate == null) {
                if (dateOrObj.start != null) {
                    selectionInput = dateOrObj;
                }
                else {
                    selectionInput = {
                        start: dateOrObj,
                        end: null
                    };
                }
            }
            else {
                selectionInput = {
                    start: dateOrObj,
                    end: endDate
                };
            }
            var selection = parseDateSpan(selectionInput, this.dateEnv, createDuration({ days: 1 }) // TODO: cache this?
            );
            if (selection) { // throw parse error otherwise?
                this.dispatch({ type: 'SELECT_DATES', selection: selection });
                this.triggerDateSelect(selection);
            }
        };
        // public method
        Calendar.prototype.unselect = function (pev) {
            if (this.state.dateSelection) {
                this.dispatch({ type: 'UNSELECT_DATES' });
                this.triggerDateUnselect(pev);
            }
        };
        Calendar.prototype.triggerDateSelect = function (selection, pev) {
            var arg = __assign({}, this.buildDateSpanApi(selection), { jsEvent: pev ? pev.origEvent : null, view: this.view });
            this.publiclyTrigger('select', [arg]);
        };
        Calendar.prototype.triggerDateUnselect = function (pev) {
            this.publiclyTrigger('unselect', [
                {
                    jsEvent: pev ? pev.origEvent : null,
                    view: this.view
                }
            ]);
        };
        // TODO: receive pev?
        Calendar.prototype.triggerDateClick = function (dateSpan, dayEl, view, ev) {
            var arg = __assign({}, this.buildDatePointApi(dateSpan), { dayEl: dayEl, jsEvent: ev, // Is this always a mouse event? See #4655
                view: view });
            this.publiclyTrigger('dateClick', [arg]);
        };
        Calendar.prototype.buildDatePointApi = function (dateSpan) {
            var props = {};
            for (var _i = 0, _a = this.pluginSystem.hooks.datePointTransforms; _i < _a.length; _i++) {
                var transform = _a[_i];
                __assign(props, transform(dateSpan, this));
            }
            __assign(props, buildDatePointApi(dateSpan, this.dateEnv));
            return props;
        };
        Calendar.prototype.buildDateSpanApi = function (dateSpan) {
            var props = {};
            for (var _i = 0, _a = this.pluginSystem.hooks.dateSpanTransforms; _i < _a.length; _i++) {
                var transform = _a[_i];
                __assign(props, transform(dateSpan, this));
            }
            __assign(props, buildDateSpanApi(dateSpan, this.dateEnv));
            return props;
        };
        // Date Utils
        // -----------------------------------------------------------------------------------------------------------------
        // Returns a DateMarker for the current date, as defined by the client's computer or from the `now` option
        Calendar.prototype.getNow = function () {
            var now = this.opt('now');
            if (typeof now === 'function') {
                now = now();
            }
            if (now == null) {
                return this.dateEnv.createNowMarker();
            }
            return this.dateEnv.createMarker(now);
        };
        // Event-Date Utilities
        // -----------------------------------------------------------------------------------------------------------------
        // Given an event's allDay status and start date, return what its fallback end date should be.
        // TODO: rename to computeDefaultEventEnd
        Calendar.prototype.getDefaultEventEnd = function (allDay, marker) {
            var end = marker;
            if (allDay) {
                end = startOfDay(end);
                end = this.dateEnv.add(end, this.defaultAllDayEventDuration);
            }
            else {
                end = this.dateEnv.add(end, this.defaultTimedEventDuration);
            }
            return end;
        };
        // Public Events API
        // -----------------------------------------------------------------------------------------------------------------
        Calendar.prototype.addEvent = function (eventInput, sourceInput) {
            if (eventInput instanceof EventApi) {
                var def = eventInput._def;
                var instance = eventInput._instance;
                // not already present? don't want to add an old snapshot
                if (!this.state.eventStore.defs[def.defId]) {
                    this.dispatch({
                        type: 'ADD_EVENTS',
                        eventStore: eventTupleToStore({ def: def, instance: instance }) // TODO: better util for two args?
                    });
                }
                return eventInput;
            }
            var sourceId;
            if (sourceInput instanceof EventSourceApi) {
                sourceId = sourceInput.internalEventSource.sourceId;
            }
            else if (sourceInput != null) {
                var sourceApi = this.getEventSourceById(sourceInput); // TODO: use an internal function
                if (!sourceApi) {
                    console.warn('Could not find an event source with ID "' + sourceInput + '"'); // TODO: test
                    return null;
                }
                else {
                    sourceId = sourceApi.internalEventSource.sourceId;
                }
            }
            var tuple = parseEvent(eventInput, sourceId, this);
            if (tuple) {
                this.dispatch({
                    type: 'ADD_EVENTS',
                    eventStore: eventTupleToStore(tuple)
                });
                return new EventApi(this, tuple.def, tuple.def.recurringDef ? null : tuple.instance);
            }
            return null;
        };
        // TODO: optimize
        Calendar.prototype.getEventById = function (id) {
            var _a = this.state.eventStore, defs = _a.defs, instances = _a.instances;
            id = String(id);
            for (var defId in defs) {
                var def = defs[defId];
                if (def.publicId === id) {
                    if (def.recurringDef) {
                        return new EventApi(this, def, null);
                    }
                    else {
                        for (var instanceId in instances) {
                            var instance = instances[instanceId];
                            if (instance.defId === def.defId) {
                                return new EventApi(this, def, instance);
                            }
                        }
                    }
                }
            }
            return null;
        };
        Calendar.prototype.getEvents = function () {
            var _a = this.state.eventStore, defs = _a.defs, instances = _a.instances;
            var eventApis = [];
            for (var id in instances) {
                var instance = instances[id];
                var def = defs[instance.defId];
                eventApis.push(new EventApi(this, def, instance));
            }
            return eventApis;
        };
        Calendar.prototype.removeAllEvents = function () {
            this.dispatch({ type: 'REMOVE_ALL_EVENTS' });
        };
        Calendar.prototype.rerenderEvents = function () {
            this.dispatch({ type: 'RESET_EVENTS' });
        };
        // Public Event Sources API
        // -----------------------------------------------------------------------------------------------------------------
        Calendar.prototype.getEventSources = function () {
            var sourceHash = this.state.eventSources;
            var sourceApis = [];
            for (var internalId in sourceHash) {
                sourceApis.push(new EventSourceApi(this, sourceHash[internalId]));
            }
            return sourceApis;
        };
        Calendar.prototype.getEventSourceById = function (id) {
            var sourceHash = this.state.eventSources;
            id = String(id);
            for (var sourceId in sourceHash) {
                if (sourceHash[sourceId].publicId === id) {
                    return new EventSourceApi(this, sourceHash[sourceId]);
                }
            }
            return null;
        };
        Calendar.prototype.addEventSource = function (sourceInput) {
            if (sourceInput instanceof EventSourceApi) {
                // not already present? don't want to add an old snapshot
                if (!this.state.eventSources[sourceInput.internalEventSource.sourceId]) {
                    this.dispatch({
                        type: 'ADD_EVENT_SOURCES',
                        sources: [sourceInput.internalEventSource]
                    });
                }
                return sourceInput;
            }
            var eventSource = parseEventSource(sourceInput, this);
            if (eventSource) { // TODO: error otherwise?
                this.dispatch({ type: 'ADD_EVENT_SOURCES', sources: [eventSource] });
                return new EventSourceApi(this, eventSource);
            }
            return null;
        };
        Calendar.prototype.removeAllEventSources = function () {
            this.dispatch({ type: 'REMOVE_ALL_EVENT_SOURCES' });
        };
        Calendar.prototype.refetchEvents = function () {
            this.dispatch({ type: 'FETCH_EVENT_SOURCES' });
        };
        // Scroll
        // -----------------------------------------------------------------------------------------------------------------
        Calendar.prototype.scrollToTime = function (timeInput) {
            var duration = createDuration(timeInput);
            if (duration) {
                this.component.view.scrollToDuration(duration);
            }
        };
        return Calendar;
    }());
}));

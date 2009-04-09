var dd_events = [
    'drag:drag',
    'drag:drophit',
    'drag:end',
    'drag:start',
    'drag:enter',
    'drag:over',
    'drop:over',
    'drop:enter',
    'drop:hit'
],
moveCount = 728;

YUI({
    base: '../../../build/',
    logExclude: {
        'YUI': true,
        Event: true,
        Base: true,
        Attribute: true,
        augment: true,
        useConsole: true
    }
}).use('dd', 'console', 'test', 'substitute', function(Y) {
        var myConsole = new Y.Console({
            height: Y.get(window).get('winHeight') + 'px'
        }).render();    
            

        _fakeMove = function(node, max) {
            _resetCount();
            Y.DD.DDM._noShim = true;
            node._dragThreshMet = true;
            node.set('activeHandle', node.get('node'));                    
            node._setStartPosition(node.get('node').getXY());
            Y.DD.DDM.activeDrag = node;
            node.start();
            for (var i = 0; i < max; i++) {
                Y.DD.DDM._move({ pageX: i, pageY: 110 });
            }
            node.end();
            node._handleMouseUp();
            Y.DD.DDM._noShim = false;
        };

        _count = {};
        _data = {
            one: 1,
            two: 2,
            three: 3
        };
        _resetCount = function() {
            Y.each(_count, function(v, k) {
                _count[k] = 0;
            });
        };
        var _handleCount = function(e) {
            if (!_count[e.type]) {
                _count[e.type] = 0;
            }
            _count[e.type]++;
        };


    template = {
        setUp : function() {
        },
        
        tearDown : function() {
        },
        
        test_shim: function() {
            var s = Y.DD.DDM._pg;
            Y.Assert.isInstanceOf(Y.Node, s, 'Shim: Node Instance');

        },
        test_drop_setup: function() {
            drop = new Y.DD.Drop({ node: '#drop', data: { one: 1, two: 2, three: 3 } });
            Y.Assert.isInstanceOf(Y.DD.Drop, drop, 'drop: Drop Instance');
            Y.Assert.isTrue(drop.get('node').hasClass('yui-dd-drop'), 'drop: Drop Instance ClassName');
        },
        test_drop_setup_events: function() {
            Y.each(dd_events, function(v) {
                var handle = drop.on(v, _handleCount);
                Y.Assert.isInstanceOf(Y.EventHandle, handle, 'drop:handle [' + v + ']: Handle Instance');
            });
        },
        test_drag_setup: function() {
            dd = new Y.DD.Drag({ node: '#drag' });
            Y.Assert.isInstanceOf(Y.DD.Drag, dd, 'dd: Drag Instance');
            Y.Assert.isTrue(dd.get('node').hasClass('yui-dd-draggable'), 'dd: Drag Instance ClassName');
        },
        test_drag_add_handle: function() {
            Y.Assert.isNull(dd._handles, 'dd: Handles NOT Null');
            dd.set('handles', ['h2']);
            Y.Assert.isObject(dd._handles, 'dd: Handles not an object');
            Y.Assert.isTrue(dd._handles.h2, 'dd: Handles H2 not there');
            dd.set('handles', false);
            Y.Assert.isNull(dd._handles, 'dd: Handles NOT Null');
            dd.addHandle('h2');
            Y.Assert.isObject(dd._handles, 'dd: Handles not an object');
            Y.Assert.isTrue(dd._handles.h2, 'dd: Handles H2 not there');
        },
        test_drag_setup_events: function() {
            Y.each(dd_events, function(v) {
                _count[v] = 0;
                var handle = dd.on(v, _handleCount);
                Y.Assert.isInstanceOf(Y.EventHandle, handle, 'drag:handle [' + v + ']: Handle Instance');
            });
        },
        test_drag_move: function() {
            _fakeMove(dd, moveCount);
            Y.Assert.areSame(moveCount, _count['drag:drag'], 'drag:drag should fire ' + moveCount + ' times');
            Y.Assert.areSame(1, _count['drag:drophit'], 'drag:drophit should fire 1 time');
            Y.Assert.areSame(1, _count['drag:end'], 'drag:end should fire 1 time');
            Y.Assert.areSame(1, _count['drag:start'], 'drag:start should fire 1 time');
            Y.Assert.areSame(1, _count['drag:enter'], 'drag:enter should fire 1 time');
            Y.Assert.areSame(30, _count['drag:over'], 'drag:over should fire 30 times');

            Y.Assert.areSame(30, _count['drop:over'], 'drop:over should fire 30 times');
            Y.Assert.areSame(1, _count['drop:enter'], 'drop:enter should fire 1 time');
            Y.Assert.areSame(1, _count['drop:hit'], 'drop:hit should fire 1 time');
        },
        test_drag_destroy: function() {
            dd.destroy();
            Y.Assert.isFalse(dd.get('node').hasClass('yui-dd-draggable'), 'drag: Drag Instance NO ClassName');
            Y.Assert.isTrue(dd.get('destroyed'), 'drag: Destroyed Attribute');
        },
        test_proxy: function() {
            _resetCount();
            Y.Node.get('#drag').setStyles({ top: '', left: '' });
            proxy = new Y.DD.Drag({ node: '#drag', proxy: true, moveOnEnd: false });
            var p = Y.DD.DDM._proxy;
            Y.Assert.isInstanceOf(Y.Node, p, 'Proxy: Node Instance');
            Y.Assert.isTrue(p.hasClass('yui-dd-proxy'), 'proxy: Proxy Node Instance ClassName');
        },
        test_proxy_setup_events: function() {
            Y.each(dd_events, function(v) {
                var handle = proxy.on(v, _handleCount);
                Y.Assert.isInstanceOf(Y.EventHandle, handle, 'proxy:handle [' + v + ']: Handle Instance');
            });
        },
        test_proxy_move: function() {
            _fakeMove(proxy, moveCount);
            
            Y.Assert.areSame(moveCount, _count['drag:drag'], 'drag:drag should fire ' + moveCount + ' times');
            Y.Assert.areSame(1, _count['drag:drophit'], 'drag:drophit should fire 1 time');
            Y.Assert.areSame(1, _count['drag:end'], 'drag:end should fire 1 time');
            Y.Assert.areSame(1, _count['drag:start'], 'drag:start should fire 1 time');
            Y.Assert.areSame(1, _count['drag:enter'], 'drag:enter should fire 1 time');
            Y.Assert.areSame(30, _count['drag:over'], 'drag:over should fire 30 times');

            Y.Assert.areSame(30, _count['drop:over'], 'drop:over should fire 30 times');
            Y.Assert.areSame(1, _count['drop:enter'], 'drop:enter should fire 1 time');
            Y.Assert.areSame(1, _count['drop:hit'], 'drop:hit should fire 1 time');
        },
        test_proxy_destroy: function() {
            proxy.destroy();
            Y.Assert.isFalse(proxy.get('node').hasClass('yui-dd-draggable'), 'proxy: Drag Instance NO ClassName');
            Y.Assert.isTrue(proxy.get('destroyed'), 'Proxy: Destroyed Attribute');
        },
        test_drop_destroy: function() {
            drop.destroy();
            Y.Assert.isFalse(drop.get('node').hasClass('yui-dd-drop'), 'Drop: Drop Instance NO ClassName');
            Y.Assert.isTrue(drop.get('destroyed'), 'Drop: Destroyed Attribute');
        },
        test_constrain_node_setup: function() {
            Y.Node.get('#drag').setStyles({ top: '10px', left: '950px' });
            dd = new Y.DD.Drag({
                node: '#drag',
                constrain2node: '#wrap'
            });
            Y.Assert.isInstanceOf(Y.DD.Drag, dd, 'dd: Drag Instance');
            Y.Assert.isTrue(dd.get('node').hasClass('yui-dd-draggable'), 'dd: Drag Instance ClassName');
        },
        test_constrain_node_move: function() {
            var inRegion_before = dd.get('node').inRegion(Y.get('#wrap'));

            _fakeMove(dd, 25);

            var inRegion_after = dd.get('node').inRegion(Y.get('#wrap'));
            Y.Assert.isFalse(inRegion_before, 'Drag Node is in the region of #wrap');
            Y.Assert.isTrue(inRegion_after, 'Drag Node is NOT in the region of #wrap');
            dd.destroy();
        },
        test_constrain_view_setup: function() {
            Y.Node.get('#drag').setStyles({ top: '-150px', left: '200px' });
            dd = new Y.DD.Drag({
                node: '#drag',
                constrain2view: true
            });
            Y.Assert.isInstanceOf(Y.DD.Drag, dd, 'dd: Drag Instance');
            Y.Assert.isTrue(dd.get('node').hasClass('yui-dd-draggable'), 'dd: Drag Instance ClassName');
        },
        test_constrain_view_move: function() {
            var inRegion_before = dd.get('node').inViewportRegion();

            _fakeMove(dd, 250);

            var inRegion_after = dd.get('node').inViewportRegion();
            Y.Assert.isFalse(inRegion_before, 'Drag Node is in the viewport');
            Y.Assert.isTrue(inRegion_after, 'Drag Node is NOT in the viewport');
            dd.destroy();
        }
    };
    
    Y.Test.Runner.clear();
    Y.Test.Runner.add(new Y.Test.Case(template));
    Y.Test.Runner.run();
});


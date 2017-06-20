(function () {
    "use strict";

    function findParentBefore(current, stopat) {
        while (current.parentNode != stopat) {
            current = current.parentNode;
            if (current == null) {
                return false;
            }
        }
        return current;
    }

var S = function() { }
S.create = function(container_element, options) {
    var items = [];
    var dragged_item = null;
    var drop_index = null;

    container_element.addEventListener('dragstart', function(evt) {
        var item = findParentBefore(evt.target, container_element);

        if (!item) { return false; }

        items = container_element.children; //container_element.querySelectorAll('.item');

        for (var _counter=0; _counter<items.length; _counter++) {
            items[_counter].index = _counter;
            items[_counter].index_orig = _counter;
        }

        item.classList.add('moving');
        evt.dataTransfer.effectAllowed = 'move'; 
        evt.dataTransfer.dropEffect = 'move'; 
        evt.dataTransfer.setData('text/html', item.innerHTML);
        dragged_item = item;
        return false;

    }, false);

    container_element.addEventListener('dragover', function(evt) {
        var item = findParentBefore(evt.target, container_element);
        var before = null;

        evt.dataTransfer.dropEffect = 'move';

        if (!item) {return false;}

        var size = item.getBoundingClientRect();

        // before = evt.clientY < ( item.offsetTop + (item.clientHeight / 2));
        before = evt.clientY < ( size.y + ( size.height / 2));

        if (evt.preventDefault) {
            evt.preventDefault(); // Necessary. Allows us to drop.
        }

        if (item != dragged_item) {
            if (before) {
                item.parentNode.insertBefore(dragged_item, items[item.index]);
                drop_index = item.index;
            } else {
                drop_index = item.index + 1;
                if (item.index == items.length) {
                    item.parentNode.appendChild(dragged_item);
                } else {
                    item.parentNode.insertBefore(dragged_item, items[item.index + 1]);
                }
            }
        }
        items = container_element.children;

        for (var _counter=0; _counter<items.length; _counter++) {
            items[_counter].index = _counter;
        }

        return false;
    });

    container_element.addEventListener('dragend', function(evt) {
        var item = findParentBefore(evt.target, container_element);

        if (!item) {return false;}

        item.classList.remove('moving');
        if(dragged_item.index < drop_index) {
            drop_index--;
        }
        options.onEnd({ oldIndex: dragged_item.index_orig, newIndex: drop_index });

    })

}
window.Sortable = S;
})();
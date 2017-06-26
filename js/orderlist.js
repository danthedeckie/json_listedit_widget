(function() {
"use strict";
var templates = {
        "default": '<div class="handle">☰</div><label>Name: $$name</label>, <label>price <input name="price" value="$price" type="number"/></label>',
        "section": '$$name',
        "notes": '$$name'
    };

function findParentBefore(current, stopat) {
    while (current.parentNode != stopat) {
        current = current.parentNode;
        if (current == null) {
            return false;
        }
    }
    return current;
    }

var Sortable = function() { }
Sortable.create = function(container_element, options) {
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

        before = evt.clientY < ( size.top + ( size.height / 2));

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

// Run only once Setup:

// Add new 'NOSUBMIT' form, to attach fields to.
var d = document.createElement('form');
d.name='NOSUBMIT';
var s = document.getElementsByTagName('script');
s = s[0]
s.parentNode.appendChild(d, s);

// Per Row:

function make_row(obj, parent) {
    var str=templates[obj._type || 'default'];
    for(var k in obj) {
        if (obj.hasOwnProperty(k)) {
            str = str.replace('$$' + k, '<input name="' + k + '" value="' + obj[k] + '" form="NOSUBMIT">')
            str = str.replace('$' + k, obj[k])
        }
    }

    str += '<button type="button" class="delete_row">x</button>'

    var div = document.createElement('div');
    div.className = 'item ' + (obj._type || 'default');
    div.innerHTML = str;
    div.draggable = true;
    div.onchange = function(evt) {
        obj[evt.target.name] = evt.target.value;
        parent.update_original();
    }
    div.getElementsByClassName('delete_row')[0].onclick = function(evt) {
        parent.delete(obj, div);
    }
    return div;
}

//////////////////////////////////////////////////////
// Per Editor object:

function make_editor(textarea) {
    var parentEl = textarea.parentNode,
        editor = document.createElement('div'),
        parsed = '',
        arr;
        //output = '';


    // Add our element / widget to the DOM:
    parentEl.insertBefore(editor, textarea);
    editor.className += ' jsonlisteditor';
    //textarea.style.display = 'none';

    //////////
    // Parse JSON:

    try {
        parsed = JSON.parse(textarea.value);
        arr = parsed[textarea.dataset['arrayname']] || parsed;
        window.a = arr;
        window.p = parsed;
    } catch (err) {
        editor.innerHTML = '<div class="error">' + err + '</div>';
        return null;
    }

    // Add original elements from array into HTML list:

    for (var i=0;i<arr.length;i++){
        editor.appendChild (make_row(arr[i], editor));
    }

    // Define some useful functions for manipulating things:

    editor.update_original = function() {
            textarea.value = JSON.stringify(parsed);
    }

    editor.add_item = function(data) {
        arr.push(data);
        editor.update_original();
        editor.appendChild(make_row(data, editor));
    }

    editor.delete = function(obj, rowdiv) {
        arr.splice(arr.indexOf(obj), 1);
        editor.update_original();
        editor.removeChild(rowdiv);
    }

    // Apply the sortable functionality:

    Sortable.create(editor, {
        "onEnd": function(evt) {
            var x = arr.splice(evt.oldIndex, 1);
            arr.splice(evt.newIndex, 0, x[0]);
            editor.update_original()
        },
        "handle": ".handle",
    });

    //////////
    // Find Buttons, and give them the right click callback

    var buttons = document.getElementsByTagName('button');

    for(var i=0;i<buttons.length;i++) {
        if (buttons[i].dataset['for'] == textarea.name) {
            buttons[i].onclick = function(evt) {
                var newitem = JSON.parse(evt.target.dataset['item']);
                editor.add_item(newitem);
            };
        }
    }

}

// Exports:
window.JsonListEditor = function(tomake) {
    if (typeof(tomake) == "string") {
        if (tomake.startsWith("#")) {
            return make_editor(document.getElementById(tomake.substr(1)));
        } else if (tomake.startsWith(".")) {
            var originals = document.getElementsByClassName(tomake.substr(1));
            for (var i=0;i<originals.length;i++) {
                make_editor(originals[i]);
            }
        }
    } else {
        make_editor(tomake);
    }
}
})();
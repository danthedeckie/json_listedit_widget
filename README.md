# JSON Sortable List Widget

Turn a textarea with JSON data in it into a sortable (by drag/drop) editable
list that keeps the text area updated as values / order / content changes.

Early proof-of-concept / demo version.

Intended for use in a POS / invoice system where we want an invoice / order to
be made up, with items, quantity, etc. But also allow sections (headers) notes
(freeform text) subtotals, and non-database items, so coming up with a pure
relational DB model/metamodel/links/thing would become overly complex and
fragile.

Additional uses, which is why I'm trying to keep it more generic, would include
a flat menu/footer editor, a 'Sir Trevor' structured content alike editor, and so on.

# Licence

MIT.

# Usage:

```html
    <textarea id="list_of_people" name="list_of_people">
        [
            {"name": "Bob", "job": "Builder"},
            {"name": "Wendy", "job": "Less Distractable Builder"},
            {"name": "Spud", "job": "Scarecrow"},
        ]
    </textarea>
    <div class="jsonlistedit_buttons" data-for="list_of_people">
        <button type="button" class="additem" data-item="{}">Add Person</button>
    </div>

    <script>
    var editor = new JSONListEdit(document.getElementById('list_of_people'),
        {
            debug: true, // Leave textarea visible
            templates: {
                'default': 'Name: $$name, Job: $$job <button class="deleteitem">x</button>'
            }
        });
    </script>
```

You now have an sortable list of loveable characters, and can easily add more
to the list with the add button.  Every edit you make will automatically update
the original textarea element.

### Configuration:

The second argument passed to JSONListEdit is the config object.  It has the
following options:

- `debug` : (`true` or `false`) Don't hide the underlying textarea object.
- `templates`: An object/map of all the templates you want to use per-type of
  thing in your list.
- `defaultvalues`: An object/map of object/maps, containing the default values
  for new items (or old items which have them missing...)
- `templateFunction`: You can use your own templating function for drawing items
  if you want to.  NOTE: This is for the *htmlcontent* of the item itself.  The
  container of that item is created / configured with the `itemElement` option.
- `domNode`: You can pass directly the dom node that you want to use as the base
  of the list.  If you don't pass one, one will be generated of `listElement` type.
- `listElement`: (`div`, `tbody`, `ol`, `article`...) what kind of DOM element do you
  want as the root node of the draggable list. (Not needed if you specify `domNode`.)
- `itemElement`: (`div`, `li`, `tr`...) what type of node do you want as the base node
  of each item in the draggable list.

### Callbacks

These you also specify as functions in `config` (`editor` when passed to a
callbackis this JSONListEdit object):

- `onItemInputChange(evt, editor)`: When an `onchange` event has been fired, before
  the data object and textarea are updated.
- `onAdd(data, newEl, editor)`: When a new item has just been added to the array.
   `data` is the data object added to the array, `newEl` is the DOM element
  representing it.
  

### Templating

There's a very basic templating function built in, which covers the commonest
case.  You can swap in your own templating system trivially - or don't bother
with one at all.

Templates are defined in the `config.templates`, and you select which one is
used for each item by use of a '`_type`' key in each object.  The default is
'`default`'.  The templating system simply replaces '`$$something`' with an
input of the same name.

You can just put in raw `<input name="thing" class="jsonlistauto" />` if you
want to.  Anything with the `.jsonlistauto` class will get its value set to the
current value of the field.  Whenever the input is changed, it will update the
underlying data object.

# JSON Sortable List Widget

Turn a textarea with JSON data in it into a sortable (by drag/drop) editable
list that keeps the text area updated as values / order / content changes.

Early proof-of-concept / demo version.

Intended for use in a POS / invoice system where we want an invoice / order
to be made up, with items, quantity, etc. But also allow sections (headers)
notes (freeform text) subtotals, and non-database items, so coming up with a
pure relational DB model/metamodel/links/thing would become overly complex
and fragile.

Additional uses, which is why I'm trying to keep it more generic, would include
a flat menu/footer editor, a 'Sir Trevor' structured content alike editor, and so on.

# Licence

MIT.

# Usage:

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

You now have an sortable list of loveable characters, and can easily add more to the list with the
add button.  Every edit you make will automatically update the original textarea element.

### Templating

There's a very basic templating function built in, which covers the commonest case.  You can swap in
your own templating system trivially.

Templates are defined in the `config.templates`, and you select which one is used for each item by use
of a '`_type`' key in each object.  The default is '`default`'.  The templating system simply replaces
'`$$something`' with an input of the same name.

'use strict';

const { Adw, Gio, Gtk } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;

function init() {
}

function fillPreferencesWindow(window) {
    const settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.topbar-menus');
    
    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup({
        title: 'Menu Settings',
        description: 'Configure which menus appear in the top bar'
    });
    page.add(group);

    const menuItems = ['File', 'Edit', 'View', 'Window', 'Help'];
    menuItems.forEach(menu => {
        const row = new Adw.ActionRow({
            title: menu,
            subtitle: `Show ${menu} menu in top bar`
        });
        
        const toggle = new Gtk.Switch({
            active: settings.get_boolean(`show-${menu.toLowerCase()}`),
            valign: Gtk.Align.CENTER,
        });
        
        settings.bind(
            `show-${menu.toLowerCase()}`,
            toggle,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        
        row.add_suffix(toggle);
        group.add(row);
    });

    window.add(page);
}


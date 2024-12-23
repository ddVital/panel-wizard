const { GObject, St, Shell, Meta, GLib, Clutter } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

let extension;


const DEFAULT_MENU_STRUCTURE = {
	'File': [
			{label: 'New Window', shortcut: '⌘N'},
			{label: 'New Tab', shortcut: '⌘T'},
			{label: 'Open...', shortcut: '⌘O'},
			{label: 'Save', shortcut: '⌘S'},
			{label: 'Save As...', shortcut: '⇧⌘S'},
			{label: 'Close Window', shortcut: '⌘W'}
	],
	'Edit': [
			{label: 'Undo', shortcut: '⌘Z'},
			{label: 'Redo', shortcut: '⇧⌘Z'},
			{label: 'Cut', shortcut: '⌘X'},
			{label: 'Copy', shortcut: '⌘C'},
			{label: 'Paste', shortcut: '⌘V'},
			{label: 'Select All', shortcut: '⌘A'}
	],
	'View': [
			{label: 'Show Sidebar', shortcut: '⌘1'},
			{label: 'Enter Full Screen', shortcut: '⌃⌘F'},
			{label: 'Zoom In', shortcut: '⌘+'},
			{label: 'Zoom Out', shortcut: '⌘-'}
	],
	'Window': [
			{label: 'Minimize', shortcut: '⌘M'},
			{label: 'Zoom', shortcut: '⌃⌘Z'},
			{label: 'Bring All to Front', shortcut: null}
	],
	'Help': [
			{label: 'Welcome Guide', shortcut: null},
			{label: 'Documentation', shortcut: null},
			{label: 'Release Notes', shortcut: null}
	]
};
    
const Extension = class Extension {
    constructor(uuid) {
        this._uuid = uuid;
				this._settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.topbar-menus');
        log('Extension constructor called');
    }

    enable() {
			log('Extension enable called');
			this._panel = Main.panel;
			this._createMenuButtons();
		}
	

    disable() {
        log('Extension disable called');
        if (this._menuButtons) {
            this._menuButtons.forEach(button => {
                if (button) button.destroy();
            });
        }
        this._menuButtons = [];
    }

		_createMenuButtons() {
			this._menuButtons = [];
			const menuItems = ['File', 'Edit', 'View', 'Window', 'Help'];
			
			menuItems.forEach(label => {
					if (this._settings.get_boolean(`show-${label.toLowerCase()}`)) {
							this._addMenuButton(label);
					}
			});
	
			// Watch for settings changes
			menuItems.forEach(label => {
					this._settings.connect(`changed::show-${label.toLowerCase()}`, () => {
							this.disable();
							this._createMenuButtons();
					});
			});
	}
	
	_addMenuButton(label) {
			let menuButton = new PanelMenu.Button(0.0, label);
			
			let buttonText = new St.Label({
					text: label,
					y_align: Clutter.ActorAlign.CENTER,
					style_class: 'panel-button-text'
			});
	
			menuButton.add_child(buttonText);
			
			const menuItems = DEFAULT_MENU_STRUCTURE[label];
			menuItems.forEach(item => {
					if (item.shortcut) {
							menuButton.menu.addAction(`${item.label}    ${item.shortcut}`);
					} else {
							menuButton.menu.addAction(item.label);
					}
			});
	
			Main.panel.addToStatusArea(`${label}-button`, menuButton, 0, 'left');
			this._menuButtons.push(menuButton);
	}
	

	_getMenuStructure() {
			try {
					return JSON.parse(this._settings.get_string('menu-structure'));
			} catch (e) {
					return DEFAULT_MENU_STRUCTURE;
			}
	}
}

function init() {
	extension = new Extension();
	return extension;
}

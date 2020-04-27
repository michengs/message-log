"use strict"
const DefaultSettings = {
"speak_voice": true
};

module.exports = function MigrateSettings(from_ver, to_ver, settings) {
	if (from_ver === undefined) {
		// Migrate legacy config file
		return Object.assign(Object.assign({}, DefaultSettings), settings);
	} else if (from_ver === null) {
		// No config file exists, use default settings
		return DefaultSettings;
	} else {
		// Migrate from older version (using the new system) to latest one
		if (from_ver + 1 < to_ver) {
			// Recursively upgrade in one-version steps
			settings = MigrateSettings(from_ver, from_ver + 1, settings);

			setTimeout(function(){ 
					return MigrateSettings(from_ver + 1, to_ver, settings); 
			}, 0);
		}
		// If we reach this point it's guaranteed that from_ver === to_ver - 1, so we can implement
		// a switch for each version step that upgrades to the next version. This enables us to
		// upgrade from any version to the latest version without additional effort!
		switch (to_ver) {
			default:
				let oldsettings = settings;
				settings = Object.assign(DefaultSettings, {});
				for (let option in settings) {
					if (option == "speak_voice") {
						let optionobj = [];
						for (let i of settings[option]) {
							if (i.id == undefined) continue;
							if (oldsettings[option]) {
								for (const oldi of oldsettings[option]) {
									if (oldi.id == i.id) {
										i = oldi;
										break;
									}
								}
							}
							optionobj.push(i);
						}
						settings[option] = optionobj;
					}
				}
				for (let option in oldsettings) {
					if (option == "speak_voice") continue;
					if (settings[option]) {
						settings[option] = oldsettings[option];
					}
				}
				break;
		}
		return settings;
	}
}
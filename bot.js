const { Client, Intents, MessageEmbed, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, MessageActionRow, MessageButton, Permissions, Modal, TextInputComponent, DMChannel, } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const ayarlar = require('./ayarlar.json');
const fs = require('fs');

//Client ve token tanımlama
const client = new Client({ intents: [Intents.FLAGS.GUILDS], partials: ['CHANNEL'] });
const token = ayarlar.TOKEN;

//Bot çalıştığında yapılacaklar
client.once('ready', () => {
  console.log('Ticket Bot Aktif Ve Destekleri Dinliyor!');

  const destekRoleId = ayarlar.DESTEK_ROLE_ID;
  const channelName = ayarlar.KANAL_ADI;
  const categoryName = ayarlar.KATEGORI_ADI;
  const destekPre = ayarlar.DESTEK_KANAL_PREFIX;
  const chaId = ayarlar.KANAL_ID;
  const channel = '';
  const categoryId = ayarlar.KATEGORI_ID;
  //Oynuyor kısmını ayarlama
  client.user.setPresence({
    activities: [{ name: 'Destek Taleplerini', type: 'WATCHING' }],
    status: 'online'
  });
  //Ticket kanal isimleri vb özelleştirme
  client.application.commands.create({
    name: 'ticket-ozellestir',
    description: 'Botun embedli mesaj içeriklerini düzenler.',
    defaultPermission: false, 
    permissions: [
      {
        id: 'ADMINISTRATOR',
        type: 'ROLE',
        permission: true
      }
    ]
  });
  //Ticket bot kurulum
  client.application.commands.create({
    name: 'ticket-bot-kurulum',
    description: 'Destek talebi oluşturmak için gerekli mesajı gönderir.',
    defaultPermission: false, 
    permissions: [
      {
        id: 'ADMINISTRATOR',
        type: 'ROLE',
        permission: true
      }
    ]
  });
  //Ticket destek rolünü ekleme komutu
  client.application.commands.create({
    name: 'ticket-destek-rol',
    description: 'Destek talebini görüntüleyecek olan yetkili kişinin rolü etiketleyin',
    options: [
      {
        name: 'rol',
        type: 'ROLE',
        description: 'Etiketlenecek rolü seçin.',
        required: true,
      },
    ],
    defaultPermission: false, 
    permissions: [
      {
        id: 'ADMINISTRATOR',
        type: 'ROLE',
        permission: true
      }
    ]
  });
  //Desteğe kişi ekler
  client.application.commands.create({
    name: 'destek-kisi-ekle',
    description: 'Kullanıldığı destek talebine görüntüleme ve yazma izni olan kişi ve kişileri ekler',
    options: [
      {
        name: 'kullanici',
        type: 'USER',
        description: 'Etiketlenecek kişiyi seçin.',
        required: true,
      },
    ],
    defaultPermission: false, 
    permissions: [
      {
        id: 'ADMINISTRATOR',
        type: 'ROLE',
        permission: true
      }
    ]
  });
  //Destekten kişi siler
  client.application.commands.create({
    name: 'destek-kisi-kaldir',
    description: 'Kullanıldığı destek talebinde görüntüleme ve yazma izni olan kişinin izinlerini siler',
    options: [
      {
        name: 'kullanici',
        type: 'USER',
        description: 'Etiketlenecek kişiyi seçin.',
        required: true,
      },
    ],
    defaultPermission: false, 
    permissions: [
      {
        id: 'ADMINISTRATOR',
        type: 'ROLE',
        permission: true
      }
    ]
  });
});

//Destek botunun kurulumu
client.on('interactionCreate', async interaction => {
  const guild = interaction.guild; 
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ticket-bot-kurulum') {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      const embed2 = new MessageEmbed()
        .setColor('#00c0fa')
        .setAuthor({ name: 'Destek Elçisi', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png', url: 'https://omerahmetkaymak.com.tr' })
        .setDescription('> Hata \n> Yetersiz izin!')
        .setImage('https://omerahmetkaymak.com.tr/kurulum.png')
        .setFooter({ text: 'Desteklerinizi emin ellere ulaştırır!', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png' })
      return interaction.reply({ embeds: [embed2], ephemeral: true});
    }
    const ayarlar = JSON.parse(fs.readFileSync('ayarlar.json'));
    const guild = interaction.guild; 
    channelName = ayarlar.KANAL_ADI;
    categoryName = ayarlar.KATEGORI_ADI;
    const category = guild.channels.cache.find(channel => channel.name === ayarlar.KATEGORI_ADI && channel.type === 'GUILD_CATEGORY');
    const channel = guild.channels.cache.find(channel => channel.name === ayarlar.KANAL_ADI && channel.type === 'GUILD_TEXT');
    if (category && channel) {  
      console.log('Kurulum zaten yapılmış.')
      const embed = new MessageEmbed()
        .setColor('#00c0fa')
        .setAuthor({ name: 'Destek Elçisi', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png', url: 'https://omerahmetkaymak.com.tr' })
        .setDescription(`Aşamalar, zaten başarıyla tamamlandı. \n\n> Bir hata olduğunu düşünüyorsanız,\n > Mevcut ise; "${categoryName}" isimli kategoriyi ve "${channelName}" isimli kanalı siliniz.`)
        .setImage('https://omerahmetkaymak.com.tr/kurulum.png')
        .setFooter({ text: 'Desteklerinizi emin ellere ulaştırır!', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png' })
      interaction.reply({ embeds: [embed], ephemeral: true});
      setTimeout(() => {
        interaction.deleteReply();
      }, 4000);
    }
    else{
      const embed0 = new MessageEmbed()
        .setColor('#00c0fa')
        .setAuthor({ name: 'Destek Elçisi', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png', url: 'https://omerahmetkaymak.com.tr' })
        .setDescription('Aşama 0: **Kurulum Başlıyor...**')
        .setImage('https://omerahmetkaymak.com.tr/kurulum.png')
        .setFooter({ text: 'Desteklerinizi emin ellere ulaştırır!', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png' })
      await interaction.reply({ embeds: [embed0], ephemeral: true});
      guild.channels.create(categoryName, {
        type: 'GUILD_CATEGORY'
      })

      .then((category) => {
        console.log(`Aşama 1: "${categoryName}" isimli kategori oluşturuldu.`);
        ayarlar.KATEGORI_ID = category.id;
        channelName = ayarlar.KANAL_ADI;
        fs.writeFileSync('ayarlar.json', JSON.stringify(ayarlar));
        const embed = new MessageEmbed()
          .setColor('#00c0fa')
          .setAuthor({ name: 'Destek Elçisi', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png', url: 'https://omerahmetkaymak.com.tr' })
          .setDescription(`Aşama 1: \n> ${categoryName} isimli kategori oluşturuldu.`)
          .setImage('https://omerahmetkaymak.com.tr/kurulum.png')
          .setFooter({ text: 'Desteklerinizi emin ellere ulaştırır!', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png' })
        interaction.followUp({ embeds: [embed], ephemeral: true});
        guild.channels.create(channelName, { type: 'text', parent: category, permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            allow: [Permissions.FLAGS.VIEW_CHANNEL],
            deny: [Permissions.FLAGS.SEND_MESSAGES],
          },
        ],
      })
          .then(channel => {
            console.log(`Aşama 2: "${channelName}" isimli metin kanalı oluşturuldu. #${channel.name}`);
            chaId = channel.id;
            ayarlar.KANAL_ID = chaId;
            fs.writeFileSync('ayarlar.json', JSON.stringify(ayarlar));
            const embed2 = new MessageEmbed()
              .setColor('#00c0fa')
              .setAuthor({ name: 'Destek Elçisi', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png', url: 'https://omerahmetkaymak.com.tr' })
              .setDescription(`> Aşama 2: \n> **"${channelName}"** isimli metin kanalı oluşturuldu. \n> #${channel.name}`)
              .setImage('https://omerahmetkaymak.com.tr/kurulum.png')
              .setFooter({ text: 'Desteklerinizi emin ellere ulaştırır!', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png' })
            interaction.followUp({ embeds: [embed2], ephemeral: true});
            const embed3 = new MessageEmbed()
              .setColor('#00c0fa')
              .setAuthor({ name: 'Destek Elçisi', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png', url: 'https://omerahmetkaymak.com.tr' })
              .setDescription('> Bir sorunuz ya da sorununuz mu var? \n> Butona tıklayıp cevaplanması için gerekli diyara ışınlanın!')
              .setImage('https://omerahmetkaymak.com.tr/destek.png')
              .setFooter({ text: 'Desteklerinizi emin ellere ulaştırır!', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png' })
            const row = new MessageActionRow()
              .addComponents(
              new MessageButton()
              .setCustomId('destek-talep')
              .setLabel('Destek Oluştur!')
              .setStyle('PRIMARY')
            );
            channel.send({ embeds: [embed3], components: [row] }); 

            const embed4 = new MessageEmbed()
              .setColor('#00c0fa')
              .setAuthor({ name: 'Destek Elçisi', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png', url: 'https://omerahmetkaymak.com.tr' })
              .setDescription('> Aşama 3: \n> **Destek talepleri** için kullanılacak olan mesaj başarıyla gönderildi. \n> Not: Eğer kategori ve kanal isimlerini değiştirmek istiyorsanız "/ticket-ozellestir" isimli komutla değiştirebilirsiniz! \n> **Yeniden kurulum gerektirebilir!**')
              .setImage('https://omerahmetkaymak.com.tr/kurulum.png')
              .setFooter({ text: 'Desteklerinizi emin ellere ulaştırır!', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png' })
            interaction.followUp({ embeds: [embed4], ephemeral: true});
            console.log(`Aşama 3: Destek talepleri için kullanılacak olan mesaj başarıyla gönderildi.`);
          })
          .catch(console.error);
      })
      .catch(console.error);
    }
  }
});

//Destek talebi butonuna tıklandıktan sonra, destek kategorisi, odası oluşturma ve mesaj gönderme
client.on('interactionCreate', async interaction => {
  const guild = interaction.guild; 
  if (interaction.isButton() && interaction.customId === 'destek-talep') {
    const ayarlar = JSON.parse(fs.readFileSync('ayarlar.json'));
    destekPre = ayarlar.DESTEK_KANAL_PREFIX;
    channelName = destekPre + interaction.user.username;

    channel = interaction.guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.name === channelName);
    if (channel) {
      const embed = new MessageEmbed()
            .setColor('#00c0fa')
            .setAuthor({ name: 'Destek Elçisi', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png', url: 'https://omerahmetkaymak.com.tr' })
            .setDescription('> Hata: \n> Zaten bir destek oluşturmuşsunuz! \n> #' + destekPre + interaction.user.username + ' Kanalından ulaşabilirsin!')
            .setImage('https://omerahmetkaymak.com.tr/destekB.png')
            .setFooter({ text: 'Desteklerinizi emin ellere ulaştırır!', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png' })
          interaction.reply({ embeds: [embed], ephemeral: true});
          setTimeout(() => {
            interaction.deleteReply();
          }, 4000);
          console.log(interaction.user.username + ' destek talebi oluşturmasına rağmen yeniden denedi.');
    }
    else{
      const modal = new Modal()
          .setCustomId('destek-olustur-modal')
          .setTitle('Sorununuz Nedir?')
          .addComponents([
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('destek-olustur-input')
                .setLabel('Cevap:')
                .setStyle('PARAGRAPH')
                .setPlaceholder('Şu sorundan şikayetçiyim veya şu konuda önerim var!')
                .setRequired(true),
            ),
          ]);
        await interaction.showModal(modal);
    } 
  }

  if (interaction.isModalSubmit()) {
    if (interaction.customId === 'destek-olustur-modal') {
        const ayarlar = JSON.parse(fs.readFileSync('ayarlar.json'));
        const guild = interaction.guild; 
        const response =
        interaction.fields.getTextInputValue('destek-olustur-input');
        const embedOlustu = new MessageEmbed()
            .setColor('#00c0fa')
            .setAuthor({ name: 'Destek Elçisi', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png', url: 'https://omerahmetkaymak.com.tr' })
            .setDescription('> Destek Talebiniz Oluşturuldu! \n> #' + destekPre + interaction.user.username + ' Kanalından ulaşabilirsin!,')
            .setImage('https://omerahmetkaymak.com.tr/destekB.png')
            .setFooter({ text: 'Desteklerinizi emin ellere ulaştırır!', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png' })
        interaction.reply({ embeds: [embedOlustu], ephemeral: true});
        setTimeout(() => {
          interaction.deleteReply();
        }, 4000);
        categoryName = ayarlar.KATEGORI_ADI;

        const category = interaction.guild.channels.cache.find(channel => channel.type === 'GUILD_CATEGORY' && channel.name === categoryName);
        categoryId = category.id.toString();
        ayarlar.KATEGORI_ID = categoryId;
        destekRoleId = ayarlar.DESTEK_ROLE_ID;

        const role = interaction.guild.roles.cache.get(destekRoleId);

        if (!role) {
          guild.channels.create(channelName, { type: 'text', parent: categoryId, permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone.id,
              deny: [Permissions.FLAGS.VIEW_CHANNEL]
            },
            {
              id: interaction.user.id,
              allow: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL],
            },
            ],
            })
            .then(async channel => {
              try {
                const embed = new MessageEmbed()
                  .setColor('#00c0fa')
                  .setAuthor({ name: 'Destek Elçisi', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png', url: 'https://omerahmetkaymak.com.tr' })
                  .setDescription('> **Destek Talebi**, \n> #' + destekPre + interaction.user.username + `\n\n > Yardım almak istediğiniz konu;\n ${response}`)
                  .setImage('https://omerahmetkaymak.com.tr/destekB.png')
                  .setFooter({ text: 'Desteklerinizi emin ellere ulaştırır!', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png' })
                const row = new MessageActionRow()
                  .addComponents(
                    new MessageButton()
                      .setCustomId('destek-kapat')
                      .setLabel('Desteği Kapat')
                      .setStyle('DANGER')
                  );
                  await channel.send({ embeds: [embed], components: [row] });
                  channel.send(interaction.user.toString());
                  console.log(interaction.user.username + ' destek talebi oluşturdu.');
                  
                  
                } catch (error) {
                  console.error(error);
                }
            });
        }else{
          guild.channels.create(channelName, { type: 'text', parent: categoryId, permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone.id,
              deny: [Permissions.FLAGS.VIEW_CHANNEL]
            },
            {
              id: interaction.user.id,
              allow: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL],
            },
            {
              id: destekRoleId,
              allow: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL],
            },
            ],
            })
            .then(async channel => {
              try {
                const embed = new MessageEmbed()
                  .setColor('#00c0fa')
                  .setAuthor({ name: 'Destek Elçisi', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png', url: 'https://omerahmetkaymak.com.tr' })
                  .setDescription('> **Destek Talebi**, \n> #' + destekPre + interaction.user.username + `\n\n > Yardım almak istediğiniz konu;\n ${response}`)
                  .setImage('https://omerahmetkaymak.com.tr/destekB.png')
                  .setFooter({ text: 'Desteklerinizi emin ellere ulaştırır!', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png' })
                const row = new MessageActionRow()
                  .addComponents(
                    new MessageButton()
                    .setCustomId('destek-kapat')
                    .setLabel('Desteği Kapat')
                    .setStyle('DANGER')
                  );
                  await channel.send({ embeds: [embed], components: [row] });
                  channel.send(interaction.user.toString());
                  console.log(interaction.user.username + ' destek talebi oluşturdu.');
                  
                } catch (error) {
                  console.error(error);
                }
            });
        }         
    }
  }
});

//Desteği görüntüleme izni olucak permi seçme
client.on('interactionCreate', async interaction => {
  if (interaction.commandName === 'ticket-destek-rol') {
    let rawdata = fs.readFileSync('ayarlar.json');
    let ayarlar = JSON.parse(rawdata);
    ayarlar.DESTEK_ROLE_ID = interaction.options.getRole('rol').id;
    fs.writeFileSync('ayarlar.json', JSON.stringify(ayarlar));
    console.log('Yeni destek rolü oluşturuldu! "' + interaction.options.getRole('rol').name + '"');
    return interaction.reply({ content: '"' + interaction.options.getRole('rol').name + '"' + ' isimli destek rolü başarıyla eklendi.', ephemeral: true });
  }
});

//Desteğe kişi ekleme
client.on('interactionCreate', async interaction => {
  if (interaction.commandName === 'destek-kisi-ekle'){
    const { options } = interaction;
    const userId = options.getUser('kullanici').id;
    const member = await interaction.guild.members.fetch(userId);
    const channel = interaction.channel;

    if (!member) {
      return interaction.reply('Lütfen geçerli bir kullanıcı etiketleyin.');
    }

    if (!channel.permissionsFor(member).has(['VIEW_CHANNEL', 'SEND_MESSAGES'])) {
      await channel.permissionOverwrites.create(member, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true
      });
      await interaction.reply(`"${member.user.username}" kullanıcısına başarıyla kanalı görüntüleme ve yazma izni verildi .`);
      console.log(channel.name + ' isimli kanala '+ `${member.user.username} isimli kullanıcı eklendi.`);
    } else {
      await interaction.reply(`"${member.user.username}" kullanıcısının zaten kanalı görüntüleme ve yazma izni var.`);
    }
  }
});

//Destekten kişi kaldırma
client.on('interactionCreate', async interaction => {
  if (interaction.commandName === 'destek-kisi-kaldir'){
    const { options } = interaction;
    const userId = options.getUser('kullanici').id;
    const member = await interaction.guild.members.fetch(userId);
    const channel = interaction.channel;

    if (!member) {
      return interaction.reply('Lütfen geçerli bir kullanıcı etiketleyin.');
    }

    if (channel.permissionsFor(member).has(['VIEW_CHANNEL', 'SEND_MESSAGES'])) {
      await channel.permissionOverwrites.create(member, {
        VIEW_CHANNEL: false,
        SEND_MESSAGES: false
      });
      await interaction.reply(`"${member.user.username}" kullanıcısını başarıyla destek kanalından kaldırdınız.`);
      console.log(channel.name + ' isimli kanaldan '+ `${member.user.username} isimli kullanıcı kaldırıldı.`);
    } else {
      await interaction.reply(`"${member.user.username}" kullanıcısının zaten kanalı görüntüleme ve yazma izni yok.`);
    }
  }
});

//Destek sil butonu kullanıcı / yazdir - sil
client.on('interactionCreate', async interaction => {
  if (interaction.isButton() && interaction.customId === 'destek-kapat'){
    const { options } = interaction;
    const userId = interaction.user.id;
    const member = await interaction.guild.members.fetch(userId);
    const channel = interaction.channel;
    const embedDestekK = new MessageEmbed()
      .setColor('#00c0fa')
      .setAuthor({ name: 'Destek Elçisi', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png', url: 'https://omerahmetkaymak.com.tr' })
      .setDescription('> Destek talebinizi kapattınız, \n \n> Bir Sorununuz olursa yine bekleriz!')
      .setImage('https://omerahmetkaymak.com.tr/destekT.png')
      .setFooter({ text: 'Desteklerinizi emin ellere ulaştırır!', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png' });
    interaction.channel.send({ embeds: [embedDestekK]});
    setTimeout(() => {
      if (channel.permissionsFor(member).has(['VIEW_CHANNEL', 'SEND_MESSAGES'])) {
        channel.permissionOverwrites.create(member, {
        VIEW_CHANNEL: false,
        SEND_MESSAGES: false
      });
      console.log(channel.name + ' isimli destek '+ `${member.user.username} tarafından kapatıldı.`);
      
    } else {
      interaction.reply(`"${member.user.username}" kullanıcısının zaten kanalı görüntüleme ve yazma izni yok.`);
    }
    }, 4000);
    const messages = await channel.messages.fetch({ limit: 100 }); // Son 100 mesajı al
    const html = `
      <html>
        <head>
          <title>Destek Talebi</title>
        </head>
        <body>
          <h1>${channel.name} Destek Talebinizin Özeti;</h1>
          <ul>
            ${messages.map(m => `<li><strong>${m.author.username}:</strong> ${m.content}</li>`).join('')}
          </ul>
        </body>
      </html>
    `;
    try{
      const buffer = Buffer.from(html, 'utf-8');
      client.users.fetch(userId).then(user => {
        user.createDM().then(dmChannel => {
          dmChannel.send({ files: [{ attachment: buffer, name: 'destek-talebiniz.html' }] });
        });
      });
    }
    catch(error){}
    console.log(interaction.user.username + ' kişisine ticket detayı gönderildi!');
    const embedDestekKP = new MessageEmbed()
      .setColor('#00c0fa')
      .setAuthor({ name: 'Destek Elçisi', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png', url: 'https://omerahmetkaymak.com.tr' })
      .setDescription('> Destek talebini kapatıldı, \n \n> Yapmak istediğiniz işlemi seçiniz;')
      .setImage('https://omerahmetkaymak.com.tr/destekT.png')
      .setFooter({ text: 'Desteklerinizi emin ellere ulaştırır!', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png' })
      const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('destek-a-sil')
          .setLabel('Sil')
          .setEmoji('🗑️')
          .setStyle('DANGER'),
        new MessageButton()
          .setCustomId('destek-a-yazdir')
          .setLabel('Yazdır')
          .setEmoji('📝')
          .setStyle('SUCCESS')
      );
    interaction.channel.send({ embeds: [embedDestekKP], components: [row] });
  }
  if (interaction.isButton() && interaction.customId === 'destek-a-yazdir'){
    const { options } = interaction;
    const userId = interaction.user.id;
    const member = await interaction.guild.members.fetch(userId);
    const channel = interaction.channel;
    const messages = await channel.messages.fetch({ limit: 100 }); // Son 100 mesajı al
    const html = `
      <html>
        <head>
          <title>Destek Talebi</title>
        </head>
        <body>
          <h1>${channel.name} Destek Talebini Özeti;</h1>
          <ul>
            ${messages.map(m => `<li><strong>${m.author.username}:</strong> ${m.content}</li>`).join('')}
          </ul>
        </body>
      </html>
    `;
    try{
      const buffer = Buffer.from(html, 'utf-8');
      client.users.fetch(userId).then(user => {
        user.createDM().then(dmChannel => {
          dmChannel.send({ files: [{ attachment: buffer, name: 'destek-talebiniz.html' }] });
        });
      });
    }
    catch(error){}
    interaction.channel.send(interaction.user.username + ' kişisine ticket detayı gönderildi!');
    console.log(interaction.user.username + ' kişisine ticket detayı gönderildi!');
  }
  if (interaction.isButton() && interaction.customId === 'destek-a-sil' && interaction.member.permissions.has('ADMINISTRATOR')){
    interaction.channel.delete();
    console.log(interaction.channel.name + ' kanalı silindi');
  }
});

//Ticket özelleştir
client.on('interactionCreate', async interaction => {
  if (interaction.commandName === 'ticket-ozellestir') {
    const embed = new MessageEmbed()
      .setColor('#00c0fa')
      .setAuthor({ name: 'Destek Elçisi', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png', url: 'https://omerahmetkaymak.com.tr' })
      .setDescription('> Özelleştirme yapmak istediğiniz konuyu seçiniz!')
      .setImage('https://omerahmetkaymak.com.tr/kurulum.png')
      .setFooter({ text: 'Desteklerinizi emin ellere ulaştırır!', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png' })
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('destek-pre')
          .setLabel('Oda Prefix')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('destek-cat')
          .setLabel('Kategori Adı')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('destek-cha')
          .setLabel('Kanal Adı')
          .setStyle('PRIMARY')
        );
    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
});

//Ticket özelleştirme - destek prefix
client.on('interactionCreate', async interaction => {
  if (interaction.isButton() && interaction.customId === 'destek-pre') {
    const modal = new Modal()
      .setCustomId('destek-pre-m')
      .setTitle('Destek Prefix Düzenleme')
      .addComponents([
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('destek-pre-input')
            .setLabel('Prefix')
            .setStyle('SHORT')
            .setPlaceholder('destek_')
            .setRequired(true),
        ),
      ]);
    await interaction.showModal(modal);
    const handler = async (modalInteraction) => {
      if (modalInteraction.isModalSubmit() && modalInteraction.customId === 'destek-pre-m') {
        let ayarlar = JSON.parse(fs.readFileSync('ayarlar.json'));
        destekPre = modalInteraction.fields.getTextInputValue('destek-pre-input');
        ayarlar.DESTEK_KANAL_PREFIX = destekPre;
        fs.writeFileSync('ayarlar.json', JSON.stringify(ayarlar));
        await modalInteraction.deferUpdate();
        client.off('interactionCreate', handler);
        const embedPreC = new MessageEmbed()
          .setColor('#00c0fa')
          .setAuthor({ name: 'Destek Elçisi', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png', url: 'https://omerahmetkaymak.com.tr' })
          .setDescription('> Destek Prefixi Güncellendi: \n> "'+ ayarlar.DESTEK_KANAL_PREFIX + '"')
          .setImage('https://omerahmetkaymak.com.tr/kurulum.png')
          .setFooter({ text: 'Desteklerinizi emin ellere ulaştırır!', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png' });
        modalInteraction.channel.send({ embeds: [embedPreC]});
        console.log('Destek Prefixi Güncellendi: ' + ayarlar.DESTEK_KANAL_PREFIX);
      }
    };
    client.on('interactionCreate', handler);
    
  }
});

//Ticket özelleştirme - kategori adı
client.on('interactionCreate', async interaction => {
  if (interaction.isButton() && interaction.customId === 'destek-cat') {
    const modal = new Modal()
      .setCustomId('destek-cat-m')
      .setTitle('Destek Kategori Düzenleme')
      .addComponents([
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('destek-cat-input')
            .setLabel('Kategori Adı:')
            .setStyle('SHORT')
            .setPlaceholder('| Destek Diyarı')
            .setRequired(true),
        ),
      ]);
    await interaction.showModal(modal);
    const handler = async (modalInteraction) => {
      if (modalInteraction.isModalSubmit() && modalInteraction.customId === 'destek-cat-m') {
        let ayarlar = JSON.parse(fs.readFileSync('ayarlar.json'));
        categoryName = modalInteraction.fields.getTextInputValue('destek-cat-input');
        ayarlar.KATEGORI_ADI = categoryName;
        fs.writeFileSync('ayarlar.json', JSON.stringify(ayarlar));
        await modalInteraction.deferUpdate();
        const embedPreCAT = new MessageEmbed()
          .setColor('#00c0fa')
          .setAuthor({ name: 'Destek Elçisi', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png', url: 'https://omerahmetkaymak.com.tr' })
          .setDescription('> Destek Kategoriniz Güncellendi: \n> "'+ ayarlar.KATEGORI_ADI + '" \n > **Aynı anda iki ve ikiden çok kullanımda işlem gecikebilir!**')
          .setImage('https://omerahmetkaymak.com.tr/kurulum.png')
          .setFooter({ text: 'Desteklerinizi emin ellere ulaştırır!', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png' });
        modalInteraction.channel.send({ embeds: [embedPreCAT], ephemeral: true });
        categoryId = ayarlar.KATEGORI_ID;
        const categoryS = await interaction.guild.channels.fetch(categoryId);
        await categoryS.setName(categoryName);
        console.log('Destek Kategorisi Adı Güncellendi: ' + ayarlar.KATEGORI_ADI);
        client.off('interactionCreate', handler);
      }
    };
    client.on('interactionCreate', handler);
  }
});

//Ticket özelleştirme - kanal adı
client.on('interactionCreate', async interaction => {
  if (interaction.isButton() && interaction.customId === 'destek-cha') {
    const modal = new Modal()
      .setCustomId('destek-cha-m')
      .setTitle('Ana Destek Kanalı Düzenleme')
      .addComponents([
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('destek-cha-input')
            .setLabel('Prefix')
            .setStyle('SHORT')
            .setPlaceholder('destek-elcisi')
            .setRequired(true),
        ),
      ]);
    await interaction.showModal(modal);
    const handler = async (modalInteraction) => {
      if (modalInteraction.isModalSubmit() && modalInteraction.customId === 'destek-cha-m') {
        let ayarlar = JSON.parse(fs.readFileSync('ayarlar.json'));
        channelName = modalInteraction.fields.getTextInputValue('destek-cha-input');
        ayarlar.KANAL_ADI = channelName;
        fs.writeFileSync('ayarlar.json', JSON.stringify(ayarlar));
        await modalInteraction.deferUpdate();
        const channel = await client.channels.fetch(ayarlar.KANAL_ID);
        const embedPreCAT = new MessageEmbed()
          .setColor('#00c0fa')
          .setAuthor({ name: 'Destek Elçisi', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png', url: 'https://omerahmetkaymak.com.tr' })
          .setDescription('> Destek Kanal Adınız Güncellendi: \n> "'+ ayarlar.KANAL_ADI + '"\n > **Aynı anda iki ve ikiden çok kullanımda işlem gecikebilir!**' )
          .setImage('https://omerahmetkaymak.com.tr/kurulum.png')
          .setFooter({ text: 'Desteklerinizi emin ellere ulaştırır!', iconURL: 'https://omerahmetkaymak.com.tr/ticket.png' });
        modalInteraction.channel.send({ embeds: [embedPreCAT], ephemeral: true });
        chaId = ayarlar.KANAL_ID;
        const channelS = await client.channels.fetch(ayarlar.KANAL_ID);
        await channelS.setName(channelName);
        console.log('Destek Kanalının Adı Güncellendi: ' + ayarlar.KANAL_ADI);
        client.removeListener('interactionCreate', handler);
      }
    };
    client.on('interactionCreate', handler);
  }
});




client.login(token);
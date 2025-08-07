// 📦 Importaciones
import express from 'express';
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

// 🟢 Configuración básica
const GUILD_ID = '1325285715130449991';
const TOTAL_CHANNEL_ID = '1392605464629608520';

// 🌐 Servidor Express para mantener el bot activo
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Bot de Discord activo ✅');
});

app.listen(PORT, () => {
  console.log(`🌍 Servidor Express corriendo en http://localhost:${PORT}`);
});

// 🤖 Inicializa el cliente de Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', async () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);

  setInterval(async () => {
    try {
      const guild = await client.guilds.fetch(GUILD_ID);
      await guild.members.fetch(); // Refresca lista de miembros

      const totalMembers = guild.memberCount;

      const channel = await guild.channels.fetch(TOTAL_CHANNEL_ID);
      if (channel && typeof channel.setName === 'function') {
        await channel.setName(`👥 Total: ${totalMembers}`);
        console.log(`👥 Total actualizado a: ${totalMembers}`);
      }
    } catch (error) {
      console.error('❌ Error actualizando total:', error);
    }
  }, 5000); // Cada 5 segundos
});

// Eventos para manejo de errores y reconexión automática
client.on('error', error => {
  console.error('❌ Error del cliente Discord:', error);
});

client.on('warn', info => {
  console.warn('⚠️ Advertencia Discord:', info);
});

client.on('shardDisconnect', (event, shardId) => {
  console.warn(`⚠️ Shard ${shardId} desconectado. Intentando reconectar...`);
});

client.on('shardReconnecting', shardId => {
  console.log(`🔄 Shard ${shardId} intentando reconectar...`);
});

client.on('disconnect', event => {
  console.warn(`⚠️ Bot desconectado, código: ${event.code}. Reconectando...`);
  client.login(process.env.TOKEN).catch(console.error);
});

// Evitar que el proceso se caiga por errores no manejados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Rechazo no manejado:', reason);
});

process.on('uncaughtException', error => {
  console.error('❌ Excepción no atrapada:', error);
});

// Login del bot
client.login(process.env.TOKEN);
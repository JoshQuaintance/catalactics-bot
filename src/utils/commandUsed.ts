import { Message } from 'discord.js';
import { getSettings } from '../utils/get-settings';
const URI = getSettings().MONGO_URI;
import mongoose from 'mongoose';
import { commandSchema } from './schemas';
import { CommandsType } from './interfaces';
import { CommandsDbInt } from './interfaces';



// Connect to the database using the URI from the variable file.
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(err => console.error(err));

/**
 * Store to the database the the command is used.
 */
export default async function commandUsed(msg: Message, cmd: CommandsType): Promise<number |void> {
  // variable to return later.
  let amountToEmbed = 0;
  const guildName = msg.guild?.toString();

  // Get the collection
  const Role = mongoose.model('Commands', commandSchema, guildName);

  // Find the document from the collection by it's prefix using the command's prefix
  await Role.findOne({ prefix: cmd.prefix }, (err: never, data: CommandsDbInt) => {
    // If there is an error getting the document throw it
    if (err) return console.log(err);
    if(msg.author.id == msg.guild?.owner?.id)
      return amountToEmbed = data.amountCalled;

    if(msg.author.id !== msg.guild?.owner?.id) {
      // Add 1 to the amount to show later, so it will show.
      amountToEmbed = data.amountCalled + 1;

      // Adds 1 to the amountCalled in the database.
      data.amountCalled++;

      // Save the data that was modified.
      data.save((err: never) => {
        if (err) throw err;
      });
    }

  });

  // Returns the amount
  return amountToEmbed;
}

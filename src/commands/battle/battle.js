const { Client, Interaction } = require('discord.js');
const path = require("path");
const fs = require("fs");


const storedData = require("../../../storedData.json")
const storedDataPath = "C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\storedData.json"

const giveAchievement = require('../achievements/utils/achievementGive')
const getClanBenefits = require('../../utils/calculateClanBenifits')
const clans = require("../../Data/clans.json");
const gameData = require('../../Data/gameData.json');
const writeJSON = require('../../utils/writeJSON');
const eggGive = require('../eggs/utils/eggGive');
const updateEgg = require('../eggs/utils/updateEgg');
const readJSON = require('../../utils/readJSON');
const createMoneyProfile = require('../economy/utils/createMoneyProfile');


const getRandomDamage = () => Math.floor(Math.random() * 100) + 1;
const getRandomChance = () => Math.random() < 0.05;

const determineEffectiveness = (damage) => {
  if (damage === 0) return 'It had **NO** effect!';
  if (damage < 20 && damage > 0) return 'It\'s **not very effective**!';
  if (damage < 40 && damage > 0) return 'It was **effective**!';
  if (damage < 75 && damage > 0) return 'It was **super effective**!';
  if (damage < -75) return 'You gained a **massive8* amount of health!'
  if (damage < -50) return 'You gained *lots* of health!'
  if (damage < -25) return 'You gained *some* health!'
  if (damage < 0) return 'You gained health!'
  return 'Critical Hit!';
};

const getNewItemValue = (number) => {
  switch (number) {
      case 1:
          return 8;
      case 2:
          return 7;
      case 3:
          return 6;
      default:
          return 5;
  }
};

const getUsernamePillowCount = (storedData, username) => {
  const userPillows = storedData[username];
  const pillowCount = Array.isArray(userPillows) ? userPillows.length : 0;
  return pillowCount;
};

// Array of objects for items
const itemsArray = [
  { name: 'Drugs', effect: 'Restores 20 HP' },
  { name: 'Drugs x3', effect: 'Restores 60 HP', amount: 3 },
  { name: 'Sawwastaken Feet Picks', effect: 'Restores 1 HP' },
  { name: 'Mimi Face Reveal', effect: 'Nothing Happened!' },
  { name: 'Female Saw Pillow', effect: 'Failed!' },
  { name: 'Escape Rope', effect: 'A 100% Chance of escape!' },
  { name: 'Plastic Fork', effect: '15 Damage!' },
  { name: 'Low Tier God', effect: 'A Small chance to INSTANTLY defeat the opponent!' },
  { name: 'Gordon Ramsay', effect: 'Young man, KYS! :zap:' },
  { name: 'Tame', effect: 'Attempting to Tame the Pillow!'},
  { name: 'Runtime Error 404', effect: 'A Random event will occur.'},
  { name: 'Fire', effect: 'Burns the opponent for 2 turns.'},
  { name: 'Hey Guys', effect: 'Deals a random amount of damage between 0 - 20 (Inclusive)'},
  { name: 'Onix Law Services', effect: 'A chance to sue the opponent!'}
];

const sawpillowPossibleMoves = [
  { name: 'Mental Disability', damage: '5', heals: false },
  { name: 'Body Pillow', damage: '10', heals: true },
  { name: ':3', damage: '35', heals: false },
  { name: '^_____^ U_U :[ ~_~ <3', damage: '25', heals: false },
  { name: 'Alcohol', damage: '1', heals: true },
  { name: 'Tsubot', damage: '5', heals: false },
  { name: 'SawWasTaken', damage: '0', heals: false },
  { name: 'Tackle', damage: '15', heals: false },
  { name: 'Scratch', damage: '10', heals: false },
  { name: 'Racism', damage: '45', heals: false },
  { name: 'The Slipper.', damage: '99', heals: false },
  { name: 'math 🤓', damage: '99', heals: false },
  { name: 'crunch', damage: '25', heals: false },
  { name: 'bite', damage: '1', heals: false },
  { name: 'crush', damage: '1', heals: false },
  { name: 'ass', damage: '35', heals: false },
  { name: 'Coke™aine', damage: '60', heals: true}
]

const readData = () => {
    try {
      const data = fs.readFileSync(storedDataPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // If the file doesn't exist or is invalid JSON, return an empty object
      return {};
    }
  };
  
  // Function to write the data to the file
  const writeData = (data) => {
    fs.writeFileSync(storedDataPath, JSON.stringify(data, null, 2), 'utf-8');
  };
  
  // Function to find or create user data and add SawPillow name
  const findOrCreateUserData = (userName, sawpillowName) => {
    // Read the existing data from the file
    const storedData = readData();
  
    // Check if the user exists in the data
    if (storedData[userName]) {
      console.log(`User ${userName} found in storedData.`);
      // Add the new SawPillow name to the array
      storedData[userName].push(sawpillowName);
    } else {
      // If the user doesn't exist, create an array with the SawPillow name
      storedData[userName] = [sawpillowName];
      console.log(`User ${userName} not found. Creating an array with the SawPillow name for them.`);
    }
  
    // Write the updated data to the file
    writeData(storedData);
  
    // Return the array of SawPillow names
    return storedData[userName];
  };
  
  const roleIDs = {
    Beginner: "1192413479391469639",
    Ametuer: "1192413626976448552",
    Intermediate: "1192413795201593435",
    Advanced: "1192413844094591017",
    Expert: "1192413895353172039",
    Master: "1192413993185325067",
    Legendary: "1192414041298182164",
    Mythical: "1192414125452689439",
    Deity: "1192414175327166474",
    Champion: "1192414262749036584",
  }

  const roleDamages = {
    Beginner: 1.1,
    Ametuer: 1.2,
    Intermediate: 1.5,
    Advanced: 2,
    Expert: 2.1,
    Master: 2.2,
    Legendary: 2.25,
    Mythical: 2.35,
    Deity: 2.4,
    Champion: 2.5,
  }
  

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
  try {
    if (client.battleOngoing) {
        // Stop the current battle if a new one is initiated
        await interaction.reply('Another battle is already in progress. Please finish the current one before starting a new one.');
        return;
      }

      
      client.battleOngoing = true;
      // writeJSON("C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\Data\\gameData.json", {
      //   inBattle: true
      // })

      await interaction.deferReply();
   
      let sawPillowImpression = Math.random() * (0.05 - 0.001) + 0.001; ///////////////////////////////////////////////
      //sawPillowImpression = 100

      let turns = 0
      let flee = false;

      let sawpillowHealth = 100; ////////////// 100
      let userHealth = 100; ////////////// 100

      let userItems = getRandomItems(getNewItemValue(getClanBenefits(interaction.user.username, clans)));
      let sawpillowMoves = getRandomMoves(8)
      let hasOnlyFled = false
      let hasOnlyFought = false
  
      const isShiny = Math.random() < .01; // .01
      const isThicc = !isShiny && Math.random() < 0.45; // 45% chance for Thicc variant
      const isVal =   !isShiny && !isThicc && Math.random() < .25 // 25% (.15)
      const isSlime = !isShiny && !isThicc && !isVal && Math.random() < .15 // 25% (.15)
      const isError = !isShiny && !isThicc && !isVal && !isSlime  && Math.random() < .1; // 10% chance for Error variant
      const isAlien = !isShiny && !isThicc && !isVal && !isSlime  && !isError && Math.random() < 0.075; // 7.5% chance for Alien variant
      const isEgg = !isShiny && !isThicc && !isVal &&  !isSlime  && !isError && !isAlien && Math.random() < 0.055; // 5.5% chance for Egg variant
      let isRuntime = false

      let message;
      let imagePath;
      
      if (isShiny) {
          message = 'A Wild Sawpillow Appeared, It\'s shiny! ✨';
          imagePath = 'C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\images\\sawAppearedShiny.png';
        
        } else if (isThicc) {
          message = 'A Wild Sawpillow Appeared, It\'s Thicc! 🍑';
          imagePath = 'C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\images\\sawAppearedThicc.png';
      
        } else if (isVal) {
          message = 'A Wild ValPillow Appeared!';
          imagePath = 'C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\images\\ValAppeared.png';
        } else if (isSlime) {
          message = 'A Wild Sawpillow Appeared, It\'s a slime! 🤮';
          imagePath = 'C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\images\\sawAppearedSlime.png';
        } else if (isError) {
          message = 'A Wild Sawpillow Appeared, It\'s an Error! 🚨';
          imagePath = 'C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\images\\sawAppearedError.png';
      } else if (isAlien) {
          message = 'A Wild Sawpillow Appeared, It\'s an Alien! 👽';
          imagePath = 'C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\images\\sawAppearedAlien.png';
        } else if (isEgg) {
            message = 'A Wild Sawpillow Appeared, It\'s an.. Egg? 🥚';
            imagePath = 'C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\images\\sawAppearedEgg.png';
       
       
          } else {
          message = 'A Wild Sawpillow Appeared!';
          imagePath = 'C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\images\\sawAppeared.png';
      }
  
      // Send the message with the image as an attachment
      await interaction.editReply({
        content: message,
        files: [{ attachment: imagePath, name: path.basename(imagePath) }],
      });

      let burn_amplifier = 1;
      let isBurning = false;
  
      while (!flee && sawpillowHealth > 0) {
        // Follow-up message with the fight options

        turns += 1
        let tamingChance = Math.random() < sawPillowImpression; // 1 in 10 chance

        if (tamingChance) {
            // Ask the user to give the SawPillow a name
            await interaction.followUp({
              content: 'You successfully tamed the SawPillow!\n*The wild SawPillow is now your companion!*\n\nWhat name would you like to give your SawPillow?',
            });
          
            // Collect the user's response for the name
            const nameFilter = (response) => response.author.id === interaction.user.id;
            const nameCollected = await interaction.channel.awaitMessages(
              { nameFilter, max: 1, time: 120000, errors: ['time'] }
            ).catch(() => {
              // Handle timeout error
              return interaction.followUp({
                content: 'Timeout, Player took too long!',
              });
            });
          
            if (nameCollected.size > 0) {
              const newName = nameCollected.first().content;
          
              // Use the name in the final message
              await interaction.followUp({
                content: `**${interaction.user.username}** successfully tamed the SawPillow!\n*The wild SawPillow is now your companion named ${newName}!*`,
              });
          
             
              findOrCreateUserData(interaction.user.username, { Name: newName, Type: isRuntime ? 'RuntimeError' : isShiny ? 'Shiny' : isThicc ? 'Thicc' : isVal ? 'Val' : isSlime ? 'Slime' : isError ? 'Error' : isAlien ? 'Alien' : isEgg ? 'Egg' :'Normal' });
          
              if (sawpillowHealth === 1)
              {
                giveAchievement(client, interaction.user, interaction, "Down but not out", "Normal")
              }

              if (getUsernamePillowCount(storedData ,interaction.user) >= 69)
              {
                giveAchievement(client, interaction.user, interaction, "nice", "Normal")
              }

              if (turns == 0 || turns == 1)
              {
                giveAchievement(client, interaction.user, interaction, "Calamity", "Secret")
              }

              if (isRuntime)
              {
                giveAchievement(client, interaction.user, interaction, "Timed out", "Normal")
              }

              if (isShiny)
              {
                giveAchievement(client, interaction.user, interaction, "It's Shiny!", "Secret")
              }

              if (hasOnlyFled)
              {
                giveAchievement(client, interaction.user, interaction, "Why are you running?!!?", "Normal")
              }

              if (hasOnlyFought)
              {
                giveAchievement(client, interaction.user, interaction, "KILL OR BE KILLED", "Secret")
              }

             
              client.battleOngoing = false;
              // writeJSON("C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\Data\\gameData.json", {
              //   inBattle: false
              // })
              return;
            }
          
            // If the user did not provide a name, use a default message
            await interaction.followUp({
              content: `**${interaction.user.username}**\nYou successfully tamed the SawPillow!\n*The wild SawPillow is now your companion!*`,
            });
          
            client.battleOngoing = false;
            return;
          }

          if (userHealth <= 0)
                {
                  await interaction.followUp({
                    content: `**${interaction.user.username}** fainted!\nThe battle has ended.`,
                  
                  });

                  if (hasOnlyFought)
                  {
                    giveAchievement(client, interaction.user, interaction, "KILL OR BE KILLED", "Secret")
                  }

                  client.battleOngoing = false;
                  return;
                }

        await interaction.followUp({
          content: `<@${interaction.user.id}>\n**Sawpillow's HP:** ${sawpillowHealth}\n**Your HP:** ${userHealth}\n**FIGHT**\n**ITEMS**\n**BREAK BAD**\n**FLEE**`,
        });
  
       
        // Wait for a reply
        const filter = (response) => response.author.id === interaction.user.id;
        const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
  
        if (collected.size > 0) {
          const userChoice = collected.first().content.toLowerCase();
  
          switch (userChoice) {
            case 'fight':
              hasOnlyFled = false
              if (turns==1)
              {
                hasOnlyFought = true
              }
              await interaction.followUp({
                content: `Which move would you like to use?\n<@${interaction.user.id}>`,
              });
  
              // Wait for a reply to get the move name
              const moveFilter = (response) => response.author.id === interaction.user.id;
              const moveCollected = await interaction.channel.awaitMessages({ moveFilter, max: 1, time: 30000, errors: ['time'] });
  
              
              

              if (moveCollected.size > 0) {
                const selectedMove = moveCollected.first().content;
                console.log(getRoleBoost(interaction, interaction.user))
                let damage = getRandomDamage() ;
                damage = damage * getRoleBoost(interaction, interaction.user)
                const effectivenessMessage = determineEffectiveness(damage);
  
                // Update sawpillowHealth based on damage
                sawpillowHealth -= Math.floor(damage*burn_amplifier);
                if (isBurning == true) 
                {
                  burn_amplifier = 1
                  isBurning = false
                  await interaction.followUp({
                    content: `SawPillow recovered from the burning!`
                  });
                }
                
  
                let extraMessage = '';
                if (sawpillowHealth < 25) {
                  extraMessage = '\n*Sawpillow is low on HP!*';
                }
  
                if (sawpillowHealth <= 0) {

                  let moneyProfilesPath = "C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\Data\\moneyProfiles.json"
                  let moneydata = readJSON(moneyProfilesPath)
                  let profileMoney

                  if (!moneydata[interaction.user.username])
                  {
                    profileMoney =  createMoneyProfile(interaction.user.username)
                  } else {
                    profileMoney = moneydata[interaction.user.username]
                  }
                 
                  let moneyGainedAmount = Math.floor(Math.random()*(Math.random()*65))
                  profileMoney.money += moneyGainedAmount

                  await interaction.followUp({
                    content: `**${interaction.user.username}** used **${selectedMove}**!\n${effectivenessMessage}\n*The wild Sawpillow fainted!*\n*Gained **$${moneyGainedAmount}**!*`
                  });

                 

                  writeJSON(moneyProfilesPath, moneydata)

                  eggGive(client, interaction.user, interaction.channel) //////// FAINTED
                  updateEgg(client, interaction.user, interaction.channel, interaction)

                  if (hasOnlyFought)
                  {
                    giveAchievement(client, interaction.user, interaction, "KILL OR BE KILLED", "Secret")
                  }
                  
                  client.battleOngoing = false;
                  return;
                }

                if (userHealth <= 0)
                {
                  await interaction.followUp({
                    content: `**${interaction.user.username}** fainted!\nThe battle has ended.`
                  });

                  if (hasOnlyFought)
                  {
                    giveAchievement(client, interaction.user, interaction, "KILL OR BE KILLED", "Secret")
                  }

                  client.battleOngoing = false;
                  return;
                }

                // SAWPILLOW FIGHTS BACK ////////////////////////////////////////////////////


                await interaction.followUp({
                  content: `**${interaction.user.username}** used **${selectedMove}**!\n${effectivenessMessage}\n${extraMessage}\n<@${interaction.user.id}>`
                });

                let sawpillowMove =  sawpillowMoves[Math.floor(Math.random() * sawpillowMoves.length)]

                if (sawpillowMove.heals == false)
                {
                  userHealth = Math.max(0, userHealth - sawpillowMove.damage);
                } else
                {
                  userHealth = Math.min(100, userHealth + sawpillowMove.damage)
                }

                let extraMessageUser = '';
                if (userHealth < 25) {
                  extraMessageUser = `\n**${interaction.user.username}** is low on HP!`;
                }

                await interaction.followUp({
                  content: `*The wild **Sawpillow** used **${sawpillowMove.name}**!*\n${determineEffectiveness(sawpillowMove.damage)}${extraMessageUser}\n<@${interaction.user.id}>`
                });


              } else {
                await interaction.followUp({
                  content: 'No move selected!',
                });
              }
              break;
  
            case 'flee':
              if (turns == 1)
              {
                hasOnlyFled = true
              }
              hasOnlyFought = false
              const fleeAttempt = Math.random() < 0.5;
  
              if (fleeAttempt) {
                await interaction.followUp({
                  content: `You couldn\'t get away!\n<@${interaction.user.id}>`
                });

                let sawpillowMove =  sawpillowMoves[Math.floor(Math.random() * sawpillowMoves.length)]

                if (sawpillowMove.heals == false)
                {
                  userHealth = Math.max(0, userHealth - sawpillowMove.damage/5);
                } else
                {
                  userHealth = Math.min(100, userHealth + sawpillowMove.damage)
                }

                let extraMessageUser = '';
                if (userHealth < 25) {
                  extraMessageUser = `\n**${interaction.user.username}** is low on HP!`;
                }

                await interaction.followUp({
                  content: `*The wild **Sawpillow** used **${sawpillowMove.name}**!*\n${determineEffectiveness(sawpillowMove.damage/5)}${extraMessageUser}\n<@${interaction.user.id}>`
                });
              } else {
                flee = true;
                await interaction.followUp({
                  content: `You fled from the Sawpillow!\n<@${interaction.user.id}>`,
                });
              }
              break;
  
            case 'items':
            case 'bag':
              hasOnlyFled = false
              hasOnlyFought = false
              await interaction.followUp({
                content: `**${interaction.user.username}'s Items:**\n${userItems.map(item => `• ${item.name}`).join('\n')}\n*Which item would you like to use?*\n<@${interaction.user.id}>`,
              });
  
              // Wait for a reply to get the item name
              const itemFilter = (response) => response.author.id === interaction.user.id;
              const itemCollected = await interaction.channel.awaitMessages({ itemFilter, max: 1, time: 30000, errors: ['time'] });
  
              if (itemCollected.size > 0) {
                const selectedItemName = itemCollected.first().content.toLowerCase();
  
                // Find the selected item in user items
                const selectedItemIndex = userItems.findIndex(item => item.name.toLowerCase() === selectedItemName);
  
                if (selectedItemIndex !== -1) {
                  let selectedItem
                  if (userItems[selectedItemIndex].amount)
                  {
                    userItems[selectedItemIndex].amount -= 1
                    if (userItems[selectedItemIndex].amount <= 0)
                    {
                      selectedItem = userItems.splice(selectedItemIndex, 1)[0];
                    } else {
                      selectedItem = userItems[selectedItemIndex]
                    }
                  } else {
                    selectedItem = userItems.splice(selectedItemIndex, 1)[0];
                  }
                  
                  
                 
  
                  // Handle the effect of the item
                  let itemEffectMessage = '';
                  switch (selectedItem.name) {
                    case 'Drugs':
                      const restoredHP = Math.min(20, 100 - userHealth);
                      userHealth += restoredHP;
                      itemEffectMessage = `**${interaction.user.username}** used **${selectedItem.name}**!\n${selectedItem.effect}\n*Your HP restored to ${userHealth}*`;
                      break;
                    case 'Sawwastaken Feet Picks':
                      userHealth = Math.min(100, userHealth + 1);
                      itemEffectMessage = `**${interaction.user.username}** used **${selectedItem.name}**!\n${selectedItem.effect}\n*Your HP restored to ${userHealth}*`;
                      break;
                    case 'Mimi Face Reveal':
                      itemEffectMessage = `**${interaction.user.username}** used **${selectedItem.name}**!\n${selectedItem.effect}`;
                      break;
                    case 'Female Saw Pillow':
                      itemEffectMessage = `**${interaction.user.username}** used **${selectedItem.name}**!\nFailed!`;
                      break;
                    case 'Escape Rope':
                      flee = true;
                      itemEffectMessage = `**${interaction.user.username}** used **${selectedItem.name}**!\n${selectedItem.effect}`;
                      client.battleOngoing = false;
                      break;
  
                    case 'Drugs x3':
                      const restoredHPDrugs3 = Math.min(30, 100 - userHealth);
                      userHealth += restoredHPDrugs3;
                      itemEffectMessage = `**${interaction.user.username}** used **${selectedItem.name}**!\n${selectedItem.effect}\n*Your HP was restored to ${userHealth}*\nYou have **${selectedItem.amount}** left.`;
                      break;
  
                    case 'Plastic Fork':
                      sawpillowHealth = Math.max(0, sawpillowHealth - 15); // Ensure it doesn't go below 0
                      itemEffectMessage = `**${interaction.user.username}** used **${selectedItem.name}**!\n${selectedItem.effect}\n*Sawpillow's HP reduced to ${sawpillowHealth}*`;
                      break;
  
                    case 'Low Tier God':
                      const faintChance = Math.random() < 0.10; // 10% chance
  
                      if (faintChance) {
                        sawpillowHealth = 0; // Set opponent's health to 0
                        itemEffectMessage = `Sawpillow, your life is **WORTHLESS!**\nYou serve **ZERO PURPOSE**!\nYou should KYS **Now!** :zap:\n**${interaction.user.username}** used **${selectedItem.name}**!\n${selectedItem.effect}\n*The wild Sawpillow fainted!*`;
                      } else {
                        // If the faint effect doesn't occur, deduct some HP (adjust the value as needed)
                        sawpillowHealth = Math.max(0, sawpillowHealth - 15); // Ensure it doesn't go below 0
                        itemEffectMessage = `Sawpillow, your life is **WORTHLESS!**\nYou serve **ZERO PURPOSE**!\nYou should KYS **Now!** :zap:\n**${interaction.user.username}** used **${selectedItem.name}**!\n${selectedItem.effect}\n*Sawpillow's HP reduced to ${sawpillowHealth}*`;
                      }
                      break;
  
                    case 'Gordon Ramsay':
                      sawpillowHealth = Math.max(0, sawpillowHealth - 65); 
                      itemEffectMessage = `**${interaction.user.username}** used **${selectedItem.name}**!\n${selectedItem.effect}\n*Sawpillow's HP reduced to ${sawpillowHealth}*`;
                      break;
                    
                    case 'Tame':
                        
                        sawpillowHealth = 100
                        itemEffectMessage = `**${interaction.user.username}** used **${selectedItem.name}**!\n${selectedItem.effect}\n*Sawpillow's HP restored to ${sawpillowHealth}*`;
                    break;

                    case 'Runtime Error 404':
                      let a = Math.random()*10

                      if (a > 75) {
                        sawpillowHealth = 100
                        
                      } else if (a < 75 && a > 25) {
                        sawpillowHealth = 1

                      } else {
                        isRuntime = true;
                      }

                      itemEffectMessage = `**${interaction.user.username}** used **${selectedItem.name}**!\n${selectedItem.effect}\n*RUNTIME ERROR 404: * **TIMED OUT**`;
                    break;
                    case 'Fire':
                     burn_amplifier = 1.3
                     itemEffectMessage = `SawPillow got Burned!`

                      break;

                      case 'Hey Guys':
                        const damage = Math.floor(Math.random() * 26); // Random damage between 0 and 25
                        sawpillowHealth = Math.max(0, sawpillowHealth - damage); // Ensure it doesn't go below 0
                        itemEffectMessage = `Hey guys and welcome back to another video on apeirophobia. \n*SawPillow's HP reduced to ${sawpillowHealth}*`;
                      break;

                      case 'Onix Law Services':

                      let argumentCredibility = .5

                      function calculateCredibility() {
                        // Generate a random number between 0 and 1
                        const randomNum = Math.random();
                    
                        // Adjust credibility by either -0.1 or +0.1 randomly
                        const credibilityAdjustment = (randomNum < 0.5) ? -0.1 : 0.1;
                  
                    
                        // Apply the adjustment
                        argumentCredibility += credibilityAdjustment;
                    
                        // Ensure the credibility stays within the range [0, 1]
                        argumentCredibility = Math.max(0, Math.min(1, argumentCredibility));
                        console.log(argumentCredibility)
                        return argumentCredibility;
                    }

                        const wildSawpillowName = 'Wild Sawpillow';
                    
                        // Initial introduction
                        await interaction.followUp({
                         content:  `⚠️⚠️ 🚨🚨 **THIS IS AN ADVERTISEMENT!!** ⚠️⚠️ 🚨🚨\n **THIS ITEM IS SPONSERED BY ONIX LAW SERVICES!**\n Introducing Onix from Onix Law Services, the lawyer with a knack for turning even the most absurd cases into legal triumphs! With Onix on your side, rest assured that 'I CAN MAKE IT LEGAL' is not just a slogan—it's a commitment to making the impossible, like figuring out your moms weight, legal!!!!!\n *CALL +33 436940254 TODAY!*`,
                         files: [{ attachment: "C:\\Users\\shado\\Documents\\Development\\ScriptingGeneral\\JS\\Firework\\src\\images\\ONIX_LAW_SERVICES.png", name: path.basename("C\:\Users\\shado\\Documents\\Development\\ScriptingGenera\l\JS\\Firework\\src\\images\\ONIX_LAW_SERVICES.png") }],
                        });

                        await interaction.followUp({
                          content:  `You encounter a wild **${wildSawpillowName}!**\nThe wild **${wildSawpillowName}** says your guilty of harrasment!`,
                         
                         });
                        setTimeout(() => {}, 2000);
                        // Start of the courtroom battle
                        await interaction.followUp('**Onix**: Objection! My client is **innocent** of **all** charges!');
                        setTimeout(() => {}, 2000);
                        // Wait for the user's input
                        await interaction.followUp('**Judge**: What is your client\'s statement?\n(Type your statement) ');
                    
                        let userStatement = await interaction.channel.awaitMessages({
                            max: 1,
                            time: 3000000, // You can adjust the time limit
                            errors: ['time'],
                        });
                    
                        // Present the client's statement
                        await interaction.followUp(`**Onix**: My client says, "${userStatement.first().content}"`);
                        setTimeout(() => {}, 2000);
                        // Wild Sawpillow's response
                        await interaction.followUp(`${wildSawpillowName}: *Cute noises*`);
                        setTimeout(() => {}, 2000);
                        // Argument credibility
                      argumentCredibility = calculateCredibility()
                     
                      let accusations = [
                        "hurt a sawpillow",
                        "tame a sawpillow",
                        "DM <@751000055229448192>",
                        "play brookhaven",
                        "hack roblox servers",
                        "do illegal shi*",
                      ]

                      await interaction.followUp(`**Onix**: Objection! My client CLEARLY said he would NEVER ${accusations[Math.floor(Math.random() * accusations.length)]}!\nTake that Sawpillow!`);
                      setTimeout(() => {}, 2000);
                      await interaction.followUp(`${wildSawpillowName}: *Cute noises* >:(`);
                      setTimeout(() => {}, 2000);
                      argumentCredibility = calculateCredibility()

                      await interaction.followUp(`**Judge**: Sawpillow, can you describe the appearance of said '${interaction.user.username}' at the given time?`);
                      setTimeout(() => {}, 2000);
                      await interaction.followUp(`${wildSawpillowName}: *Cute noises* !!!! :( >:(`);

                      setTimeout(() => {}, 2000);
                    await interaction.followUp(`**Onix**: <@${interaction.user.id}>, your clearly innocent! My client said he would NEVER do that, they wouldn't even THINK of it!`);
                    setTimeout(() => {}, 1000);
                    await interaction.followUp(`${wildSawpillowName}: *angry and cute noises* >:( :( :[ =/ ¬_¬ :| :'( :3`);
                    setTimeout(() => {}, 2000);
                    argumentCredibility = calculateCredibility()
                    await interaction.followUp(`**Judge**: ORDER IN THE COURT!!!!!`);
                    setTimeout(() => {}, 3000);
                    await interaction.followUp(`**Judge**: <@${interaction.user.id}> The jury will now decide. Any final statements? This will be taken into account.`);

                    await interaction.channel.awaitMessages({
                      max: 1,
                      time: 3000000, // You can adjust the time limit
                      errors: ['time'],
                  });

                    argumentCredibility = calculateCredibility()

                        if (argumentCredibility > 0.5) {
                            // If credibility is above the threshold, Onix wins the case
                            await interaction.followUp('Judge: The court finds in favor of the defense! Case dismissed.');
                            userHealth = 100
                            sawpillowHealth = 1
                        } else {
                            // If credibility is below the threshold, Onix loses the case
                            await interaction.followUp('Judge: The court rules against the defense. Guilty!');
                            userHealth = 1
                            sawpillowHealth = 100
                        }
                    
                        // End of the courtroom battle
                        break;
                    
                    default:
                      itemEffectMessage = `**${interaction.user.username}** used **${selectedItem.name}**!\n${selectedItem.effect}`;
                      break;
                  }
  
                if (itemEffectMessage)
                {
                  await interaction.followUp({
                    content: `${itemEffectMessage}\n`,
                  });
                }

                  


                  ////////

                  let sawpillowMove =  sawpillowMoves[Math.floor(Math.random() * sawpillowMoves.length)]


                  if (sawpillowMove.heals == false)
                  {
                    userHealth = Math.max(0, userHealth - Math.floor((sawpillowMove.damage / 4)));
                  } else
                  {
                    userHealth = Math.min(100, userHealth + sawpillowMove.damage)
                  }
              
                  let extraMessageUser = '';
                  if (userHealth < 25) {
                    extraMessageUser = `\n**${interaction.user.username}** is low on HP!`;
                  }

                  if (selectedItem.name.toLowerCase() == "escape rope")
                  {
                    return
                  } else {
                    await interaction.followUp({
                      content: `*The wild **Sawpillow** used **${sawpillowMove.name}**!*\n${determineEffectiveness(sawpillowMove.damage/4)}${extraMessageUser}\n<@${interaction.user.id}>`
                    });
                  }
              
                 
                } else {
                  // The selected item doesn't exist or has already been used
                  await interaction.followUp({
                    content: 'Invalid item selected or item has already been used!',
                  });
                }
              } else {
                await interaction.followUp({
                  content: 'No item selected!',
                });
              }
              break;
  
            case 'Break Bad':
            case 'break':
            case 'break bad':
              hasOnlyFled = false
              hasOnlyFought = false
            const breakBadSuccess = Math.random() < 0.25;

  if (breakBadSuccess) {
    // Calculate additional impression percentage between 10 - 25
    const additionalImpression = Math.random() * (0.05 - 0.005) + 0.005;
    
    
    if (sawpillowHealth < 50) {
      sawPillowImpression += (100 - sawpillowHealth) / 1000
    } 

    // Ensure it doesn't exceed 100
    sawPillowImpression = Math.min(sawPillowImpression, 1);

    // 50% chance of different reactions
    const impressed = Math.random() < 0.5;
    
    await interaction.followUp({
      content: `**<@${interaction.user.id}>** successfully **broke bad!**\n${impressed ? '*SawPillow is impressed*' : '*SawPillow doesnt seem to care.*'}`,
    });
  } else {
    await interaction.followUp({
      content: '**Failed!**',
    });

    let sawpillowMove =  sawpillowMoves[Math.floor(Math.random() * sawpillowMoves.length)]


    if (sawpillowMove.heals == false)
    {
      userHealth = Math.max(0, userHealth - Math.floor((sawpillowMove.damage / 4)));
    } else
    {
      userHealth = Math.min(100, userHealth + sawpillowMove.damage)
    }

    let extraMessageUser = '';
    if (userHealth < 25) {
      extraMessageUser = `\n**${interaction.user.username}** is low on HP!`;
    }

    await interaction.followUp({
      content: `*The wild **Sawpillow** used **${sawpillowMove.name}**!*\n${determineEffectiveness(sawpillowMove.damage/4)}${extraMessageUser}\n<@${interaction.user.id}>`
    });
  }

            break;
            
            default:
              // Handle other choices if needed
              await interaction.followUp({
                content: 'Invalid choice!',
              });
              break;
          }
        }
      }
  
      client.battleOngoing = false;
  } catch (error) {
    console.log(error)
    client.battleOngoing = false;

    if (error === "[object Map]" || error === "Collection(0) [Map] {}")
    {
      error = "[1]: Battle timeout, player took too long to respond!"
    }

    await interaction.followUp({
        content: `An error occured and the battle has been stopped. Error: ${error} `
    });
  }
  },

  name: 'battle',
  description: 'Starts a SawPillow Battle',
  options: [],
};

// Function to get 5 random items from the items array
function getRandomItems(count) {
  const shuffledItems = itemsArray.sort(() => 0.5 - Math.random());
  return shuffledItems.slice(0, count);
}

function getRandomMoves(count) {
  const shuffledItems = sawpillowPossibleMoves.sort(() => 0.5 - Math.random());
  return shuffledItems.slice(0, count);
}

function getRoleBoost(interaction, guildMemberInteraction) {

  const roleIDs = {
    Beginner: "1192413479391469639",
    Ametuer: "1192413626976448552",
    Intermediate: "1192413795201593435",
    Advanced: "1192413844094591017",
    Expert: "1192413895353172039",
    Master: "1192413993185325067",
    Legendary: "1192414041298182164",
    Mythical: "1192414125452689439",
    Deity: "1192414175327166474",
    Champion: "1192414262749036584",
  }

  const roleDamages = {
    Beginner: 1.1,
    Ametuer: 1.2,
    Intermediate: 1.5,
    Advanced: 2,
    Expert: 2.1,
    Master: 2.2,
    Legendary: 2.25,
    Mythical: 2.35,
    Deity: 2.4,
    Champion: 2.5,
  }

  let guildMember = interaction.guild.members.cache.get(guildMemberInteraction.id);

  if (guildMember) {
    // Get the roles the member has
    const memberRoles = guildMember.roles.cache;

    // Find the highest role the member has
    const highestRole = Object.keys(roleIDs).reverse().find(roleName => memberRoles.has(roleIDs[roleName]));

    if (highestRole) {
        // Get the damage corresponding to the highest role
        const damage = roleDamages[highestRole];
        console.log(`${interaction.user.tag} has the highest role "${highestRole}" with damage ${damage}.`);
        return damage;
    } else {
       return 1
    }
} else {
  return 1
}
}


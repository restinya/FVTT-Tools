if (!actor) {
    ui.notifications.warn("You must have an actor selected");
  } else if (actor.getFlag("pf2e", "overdriveActive")) {
    actor.setFlag("pf2e", "overdriveActive", !actor.getFlag("pf2e", "overdriveActive"));
    canvas.tokens.controlled.forEach(token => {
        token.actor.setFlag("pf2e", "overdriveActive", !actor.getFlag("pf2e", "overdriveActive"));
        let weapons = token.actor.items.filter(item => item.data.type === "weapon");
        weapons.forEach(weapon => { weapon.data.data.bonusDamage.value = 0 });
        ChatMessage.create({
            content: "Powering down..."
        });
    });
  } else {
    const skillDC = 14 + actor.data.data.details.level.value;
    const skillName = "Overdrive";
    const skillKey = "cra";
    const actionSlug = "Overdrive"
    const actionName = "Overdrive"
  
    const modifiers = []
  
    const notes = [...token.actor.data.data.skills[skillKey].notes]; // add more notes if necessary
    const options = token.actor.getRollOptions(['all', 'skill-check', skillName.toLowerCase()]);
    options.push(`action:${actionSlug}`);
    game.pf2e.Check.roll(
      new game.pf2e.CheckModifier(
        `<span class="pf2-icon">A</span> <b>${actionName}</b> - <p class="compact-text">${skillName } Skill Check</p>`,
        token.actor.data.data.skills[skillKey], modifiers ),
        { actor: token.actor, type: 'skill-check', options, notes, dc:  {value:skillDC} },
        event,
        (roll) => {
            console.log(roll);
            const resultNum = roll._total;
          if (resultNum >= skillDC + 10) {
              //insert crit effect
              (async () => {
              for await (const token of canvas.tokens.controlled) {
                token.actor.setFlag("pf2e", "overdriveActive", !actor.getFlag("pf2e", "overdriveActive"));
                let weapons = token.actor.items.filter(item => item.data.type === "weapon");
                weapons.forEach(weapon => { weapon.data.data.bonusDamage.value = actor.data.data.abilities.int.mod });
              }
              })();
          } else if (resultNum >= skillDC) {
              //insert success effect
              (async () => {
                for await (const token of canvas.tokens.controlled) {
                  token.actor.setFlag("pf2e", "overdriveActive", !actor.getFlag("pf2e", "overdriveActive"));
                  let weapons = token.actor.items.filter(item => item.data.type === "weapon");
                  weapons.forEach(weapon => { weapon.data.data.bonusDamage.value = Math.floor(actor.data.data.abilities.int.mod/2) });
                }
                })();
          }
        },
    );
  }
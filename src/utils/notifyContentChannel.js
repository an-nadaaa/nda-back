const sendToTelegram = require("./sendMessageToTelegram");

module.exports = async (event) => {
  console.debug(event.result);
  const unparsed = Symbol.for("unparsedBody");
  let message, updatedBy, ids, entity;
  if (!event.params.data) {
    ids = event.params.where.$and[1].$and[0].id.$in;
  }
  switch (event.action) {
    case "afterCreate":
      entity = event.result;
      updatedBy = await strapi.db.query("admin::user").findOne({
        where: {
          id: entity.updatedBy,
        },
      });
      message = `
            A new ${event.model.singularName} has been created!
Environment: ${entity.environment}
Updated By: ${updatedBy.email}
Title: ${entity.title}
Description: ${entity.description}
            `;
      break;
    case "afterUpdate":
      if (event.params.data) {
        entity = JSON.parse(event.params.data[unparsed]);
        updatedBy = await strapi.db.query("admin::user").findOne({
          where: {
            id: entity.updatedBy,
          },
        });
        message = `
                        A ${event.model.singularName} has been Updated!
Environment: ${entity.environment}
Updated By: ${updatedBy.email}
Title: ${entity.title}
Description: ${entity.description}
                        `;
      } else {
        message = `
                        Many ${event.model.singularName} has been Updated!
Environment: ${entity.environment}
Updated By: ${updatedBy.email}
${ids.map(async (id) => {
  entity = await strapi.db.query(`${event.model.uid}`).findOne({ id });
  return `Title: ${entity.title}
Description: ${entity.description}
    `;
}).join(`
`)}
                        `;
      }
      break;
    case "afterDelete":
      if (event.params.data) {
        entity = JSON.parse(event.params.data[unparsed]);
        updatedBy = await strapi.db.query("admin::user").findOne({
          where: {
            id: entity.updatedBy,
          },
        });
        message = `
                            A ${event.model.singularName} has been Deleted!
Environment: ${entity.environment}
Updated By: ${updatedBy.email}
Title: ${entity.base.title}
Description: ${entity.base.description}
                            `;
      } else {
        message = `
                            Many ${event.model.singularName} has been Deleted!
Environment: ${entity.environment}
Updated By: ${updatedBy.email}
    ${ids.map(async (id) => {
      entity = await strapi.db.query(`${event.model.uid}`).findOne({ id });
      return `Title: ${entity.base.title}
Description: ${entity.base.description}
        `;
    }).join(`
    `)}
                            `;
      }
      break;
    default:
      message = `${event.model.singularName} ${event.action} lifecycle triggered`;
      break;
  }
  await sendToTelegram(message, "editorial");
};

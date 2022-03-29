const sendToTelegram = require("./sendMessageToTelegram");

module.exports = async (event) => {
  strapi.log.debug("event", event);
  strapi.log.debug("event.params", event.params);
  strapi.log.debug("event.params.data", event.params.data);
  const unparsed = Symbol.for("unparsedBody");
  let message, updatedBy, ids, entity;
  if (event.params.data) {
    entity = event.params.data;
    entity = await strapi.db.query("api::cause.cause").findOne({
      where: {
        id: entity.id,
      },
      populate: ["base"],
    });
  } else {
    ids = event.params.where.$and[1].$and[0].id.$in;
  }
  switch (event.action) {
    case "afterCreate":
      updatedBy = await strapi.db.query("admin::user").findOne({
        where: {
          id: entity.updatedBy,
        },
      });
      message = `
            A new ${event.model.singularName} has been created!
Environment: ${entity.environment}
Updated By: ${updatedBy.email}
Title: ${entity.base.title}
Description: ${entity.base.description}
            `;
      break;
    case "afterUpdate":
      if (entity) {
        updatedBy = await strapi.db.query("admin::user").findOne({
          where: {
            id: entity.updatedBy,
          },
        });
        message = `
                        A ${event.model.singularName} has been Updated!
Environment: ${entity.environment}
Updated By: ${updatedBy.email}
Title: ${entity.base.title}
Description: ${entity.base.description}
                        `;
      } else {
        message = `
                        Many ${event.model.singularName} has been Updated!
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
    case "afterDelete":
      if (entity) {
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

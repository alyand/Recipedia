/*
    Topics (routing keys) : 
    1. review.created
        -> Memberitahu ada review yang baru dibuat
        PUB : review-service
        SUB : recipe-service

    2. review.deleted
        -> Memberitahu ada review yang baru dihapus
        PUB : review-service
        SUB : recipe-service
    
    3. recipe.deleted
        -> Memberitahu ada resep yang dihapus
        PUB : recipe-service
        SUB : review-service
    
    4. user.deleted
        -> Memberitahu ada user yang dihapus
        PUB : user-service
        SUB : recipe-service, review-service
*/

module.exports = {
  EXCHANGES: {
    USER_EVENTS: "user_events", // exchange for user
    RECIPE_EVENTS: "recipe_events", // exchange for recipe
    REVIEW_EVENTS: "review_events", // exchange for review
  },
  ROUTING_KEYS: {
    REVIEW_CREATED: "review.created", // queue for when review is created
    REVIEW_DELETED: "review.deleted", // queue for when a review is deleted
    RECIPE_DELETED: "recipe.deleted",
    USER_DELETED: "user.deleted",
  },
  QUEUES: {
    USER_SERVICE: "user-queue",
    RECIPE_SERVICE: "recipe-queue",
    REVIEW_SERVICE: "review-queue",
  },
};

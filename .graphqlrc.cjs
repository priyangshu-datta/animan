module.exports = {
    projects: {
        app: {
            schema: "./schema.graphql",
            documents: ["./src/**/*.{graphql,gql}"],
            extensions: {
                endpoints: {
                    default: {
                        url: "https://graphql.anilist.co",
                    },
                },
            },
        },
    },
}

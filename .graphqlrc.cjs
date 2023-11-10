module.exports = {
    projects: {
        app: {
            schema: "./schema.graphql",
            documents: ["./src/**/*.{graphql,gql, svelte}"],
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

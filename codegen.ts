import type { CodegenConfig } from "@graphql-codegen/cli"
import { z } from "zod"

const config: CodegenConfig = {
    overwrite: true,
    schema: "https://graphql.anilist.co",
    documents: ["./src/**/*.{gql,graphql}"],
    generates: {
        "./src/lib/graphql/": {
            preset: "client",
            plugins: ["typescript", "typescript-operations"],
            config: {
                immutableTypes: false,
            },
        },
    },
}
export default config

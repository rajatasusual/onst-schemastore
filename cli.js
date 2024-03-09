const { categorizeSchemas } = require('./main');

/**
 * Finds schemata based on input using inquirer-autocomplete.
 *
 * @param {string} input - The input to search schemata for.
 * @param {Array} categorizedSchemas - The array of categorized schemata.
 * @return {Array} The array of filtered schemata.
 */
function findSchema(input, categorizedSchemas) {
    if (!input) {
        return categorizedSchemas.map(schema => schema.name);
    }

    const filteredSchemata = categorizedSchemas
        .filter(schema => schema.name.toLowerCase().includes(input.toLowerCase()))
        .map(schema => schema.name);

    return filteredSchemata
}

/**
 * Fetches the schema from the schema store using autocomplete to select an entity.
 *
 * @return {Object} The selected schema object.
 */
async function fetchSchemaFromSchemaStore() {

    const { default: autocomplete } = await import(
        'inquirer-autocomplete-standalone'
    );

    const categorizedSchemas = await categorizeSchemas();

    const answer = await autocomplete({
        message: 'Which entity would you want to download?',
        source: async (input) => {
            const filteredCountries = await findSchema(input, categorizedSchemas)
            return filteredCountries.map(schema => {
                return {
                    value: schema,
                    description: `${schema} selected`
                }
            })
        }
    });

    const result = categorizedSchemas.find(schema => schema.name === answer);

    console.log(`${answer} has ${result.schema.length} ${result.schema.length === 1 ? 'schema' : 'schemata'}.`);

    result.schema.forEach(schema => {
        console.log(`- ${schema.name} - ${schema.url}`);
    })

}

fetchSchemaFromSchemaStore();
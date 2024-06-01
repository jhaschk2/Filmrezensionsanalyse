import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { LlamaModel, LlamaContext, LlamaChatSession } from "node-llama-cpp";

const __dirname = dirname(fileURLToPath(import.meta.url));

const models = {
    'mixtral-8x7b': 'mixtral-8x7b-instruct-v0.1.Q4_K_M.gguf',
} as const;

console.log(__dirname)

const experimentInputs = await readdir(join(__dirname, 'input'))
    .then(dirs => dirs.filter(dir => !dir.startsWith('.')))
    .then(dirs => dirs.map(dir => 
        readdir(join(__dirname, 'input', dir))
            .then(filenames => filenames.filter(name => name.includes('Result')))
            .then(filenames => filenames.map(name => join(__dirname, 'input', dir, name)))
    ))
    .then(promises => Promise.all(promises))
    .then(paths => paths.flat())

const model = new LlamaModel({
    modelPath: models['mixtral-8x7b'],
    gpuLayers: 8,
});

const prompt = async (text: string) => {
    const context = new LlamaContext({ model, seed: null });
    const session = new LlamaChatSession({
        context,
        systemPrompt: `You are now a linguistic assistant, and your task is to predict movie ratings on a scale from 1 to 10 based solely on user-generated text comments. Your training data consists of scraped reviews for the movie 'Star Wars: The Force Awakens,' where users have rated the film from 1 to 10. 1 equals very bad, 10 equals very good. Respond with only the predicted number. An example would be:`,
        conversationHistory: [
            {
                prompt: `From the scale of 1-10. How did the user like this movie?\n"I hated this movie with my whole heart. I've never seen anything this bad."`,
                response: '1',
            }
        ]
    });
    return session.prompt(`From the scale of 1-10. How did the user like this movie?\n${text}`, { temperature: 0.2 });
}

for (const file of experimentInputs) {
    const content = await readFile(file, { encoding: 'utf-8'});
    const lines = content.split('\n').filter(v => !!v);
    const inputs = lines.slice(1).map(line => line.split('\t').filter(v => !!v).map(v => v.trim()))
        .map(line => ({ id: line[0], rating: line[1], text: line[2] }));

    const outFile = file.replace('input', 'output');
    await mkdir(dirname(outFile), { recursive: true });

    try {
        await access(outFile);
        console.log(`${file} exists, skipping`);
        continue;
    } catch (e) {}
    

    const results: { id: string; predicted: string; rating: string }[] = [
        { id: 'ID', rating: 'Rating', predicted: 'Predicted' },
    ];
   
    for (const input of inputs) {
        console.time('prediction');
        const answer = await prompt(input.text);
        console.log(`ID: ${input.id}\nReview:\n${input.text}\n\nPrediction: ${answer}\nActual rating: ${input.rating}`);
        console.timeEnd('prediction');
        results.push({ id: input.id, rating: input.rating, predicted: answer });
        await writeFile(outFile, results.map(({ id, predicted, rating }) => `${id}\t${rating}\t${predicted}`).join('\n'));
    }
}

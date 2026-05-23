const { createClient } = require("@deepgram/sdk");
const fs = require("fs");

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);


const transcribeAudio = async (filePath, mimeType) => {
  const audioBuffer = fs.readFileSync(filePath);

  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    audioBuffer,
    {
      model: "nova-2",
      smart_format: true,
      language: "en",
      mimetype: mimeType,
    }
  );

  if (error) {
    throw new Error(`Deepgram error: ${error.message}`);
  }

  const channel = result.results.channels[0];
  const alternative = channel.alternatives[0];

  return {
    transcript: alternative.transcript,
    confidence: alternative.confidence,
    duration: result.metadata.duration,
    requestId: result.metadata.request_id,
  };
};

module.exports = { transcribeAudio };

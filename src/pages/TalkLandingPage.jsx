
const TalkLandingPage = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-500 to-blue-100 relative overflow-hidden">
      <div className="absolute top-[20%] left-[8%] max-w-md text-left text-white">
        <h4 className="text-lg font-light tracking-wide text-white/80">ARTIFICIAL INTELLIGENCE</h4>
        <h1 className="text-6xl font-bold my-4 text-white">
          CHAT <span className="bg-white text-blue-800 px-2 rounded">BOT</span>
        </h1>
        <p className="text-white/90 text-sm leading-relaxed mb-6">
          A chatbot is a piece of software that conducts a conversation via auditory or textual methods.
          Such programs are often designed to convincingly simulate how a human would behave as a conversational partner.
        </p>
        <button className="bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-6 rounded shadow-md">
          LEARN MORE
        </button>
      </div>
      <div className="absolute bottom-0 right-[5%] flex items-end gap-8">
        <img
          src="/boy.png"
          alt="Boy"
          className="w-[140px] md:w-[170px] animate-float"
        />
        <div className="relative">
          <img
            src="/phone.png"
            alt="Phone"
            className="w-[160px] md:w-[200px] rotate-[15deg] drop-shadow-xl"
          />
          <img
            src="/chatbot.png"
            alt="Chatbot"
            className="absolute bottom-[50%] left-[35%] w-[80px] md:w-[100px] animate-bounce"
          />
        </div>
      </div>
      <div className="absolute right-[20%] top-[25%] w-32 h-20 bg-white/20 rounded-lg backdrop-blur-md text-white flex items-center justify-center text-sm">
        💬
      </div>
      <div className="absolute right-[15%] top-[40%] w-24 h-14 bg-white/20 rounded-lg backdrop-blur-md text-white flex items-center justify-center text-sm">
        🗨️
      </div>
      <button className="absolute bottom-6 right-6 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded shadow-md text-sm">
        CHAT WITH ME
      </button>
    </div>
  );
};
export default TalkLandingPage;


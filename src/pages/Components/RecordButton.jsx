const RecordButton = ({ isRecording, onClick, elapsedTime }) => (
    <div
      onClick={!isRecording ? onClick : undefined}
      className={`absolute cursor-pointer bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-16 flex items-center justify-center rounded-full shadow-lg ${
        isRecording
          ? "bg-[#F44336] text-white"
          : "bg-[#34919C] hover:bg-[#227A70] text-white transition duration-300"
      }`}
    >
      {isRecording ? (
        <span className="text-lg">{elapsedTime}s</span>
      ) : (
        <span className="text-xl font-bold">REC</span>
      )}
    </div>
  );

  export default RecordButton
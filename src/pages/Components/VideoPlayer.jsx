const VideoPlayer = ({ videoURL, videoRef, stream }) => (
  <>
    {videoURL ? (
      <div className="mt-6">
        <video
          src={videoURL}
          controls
          playsInline
          className="w-full rounded-lg mt-4"
        />

        <a
          href={videoURL}
          download="recording.webm"
          className="block mt-2 text-[#34919C] font-semibold"
        >
          Download Video
        </a>
      </div>
    ) : (
      <video
        style={{
          transform: "scaleX(-1)", // Apply mirroring if it's the front camera
        }}
        ref={videoRef}
        autoPlay
        muted
        className="w-full rounded-lg"
      ></video>
    )}
  </>
);

export default VideoPlayer;

const CountdownOverlay = ({ countdown }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="text-6xl font-bold text-white">{countdown}</div>
    </div>
  );

  export default CountdownOverlay
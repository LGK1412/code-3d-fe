export default function BackgroundWrapper({ bgName, children, className = '' }) {
  return (
    <div
      className={`bg-cover bg-center bg-no-repeat min-h-screen ${className}`}
      style={{
        backgroundImage: `url('/background/${bgName}.png')`,
      }}
    >
      {children}
    </div>
  );
}

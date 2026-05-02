export default function PhoneLink({
  light = false,
  className = "",
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    <a
      href="tel:18568434676"
      className={`phone-link ${light ? "light" : ""} ${className}`}
    >
      1-856-THE-HORN
      <span className="phone-tooltip">1-856-843-4676</span>
    </a>
  );
}

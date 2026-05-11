export default function PhoneLink({
  light = false,
  className = "",
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    <a
      href="tel:+19892664381"
      className={`phone-link ${light ? "light" : ""} ${className}`}
    >
      (989) 266-4381
    </a>
  );
}

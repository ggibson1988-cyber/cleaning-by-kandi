export default function SparkleAccent({ className = '' }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block align-middle text-sky-400 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M10 2L12.8 7.2L18 10L12.8 12.8L10 18L7.2 12.8L2 10L7.2 7.2L10 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

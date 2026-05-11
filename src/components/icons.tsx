import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

function IconBase({ children, title, ...props }: IconProps) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function DropletIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3.5C9.4 7 6.5 10.7 6.5 14a5.5 5.5 0 0 0 11 0C17.5 10.7 14.6 7 12 3.5Z" />
    </IconBase>
  );
}

export function AlarmClockIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="13" r="6.5" />
      <path d="M8 3.7 5.4 6.1" />
      <path d="M16 3.7 18.6 6.1" />
      <path d="M12 9.5V13l2.4 1.5" />
      <path d="M9.2 20.2 8 22" />
      <path d="M14.8 20.2 16 22" />
    </IconBase>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M18 9.8a6 6 0 0 0-12 0c0 6-2.2 6.8-2.2 6.8h16.4S18 15.8 18 9.8Z" />
      <path d="M10 20a2.2 2.2 0 0 0 4 0" />
    </IconBase>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m3.8 11 8.2-7 8.2 7" />
      <path d="M5.8 10.2V20h12.4v-9.8" />
      <path d="M10 20v-5.5h4V20" />
    </IconBase>
  );
}

export function SproutIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 20V9.8" />
      <path d="M12 10.4c-3.6.2-6.1-1.6-7-5.4 3.8-.4 6.5 1.3 7 5.4Z" />
      <path d="M12.2 13.2c3.6.2 6.1-1.6 7-5.4-3.8-.4-6.5 1.3-7 5.4Z" />
      <path d="M7 20h10" />
    </IconBase>
  );
}

export function GearIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z" />
      <path d="M18.7 13.6a7.4 7.4 0 0 0 0-3.2l2-1.5-2-3.4-2.4 1a7.8 7.8 0 0 0-2.8-1.6L13.2 2h-4l-.4 2.9A7.8 7.8 0 0 0 6 6.5l-2.4-1-2 3.4 2 1.5a7.4 7.4 0 0 0 0 3.2l-2 1.5 2 3.4 2.4-1a7.8 7.8 0 0 0 2.8 1.6l.4 2.9h4l.4-2.9a7.8 7.8 0 0 0 2.8-1.6l2.4 1 2-3.4-2.1-1.5Z" />
    </IconBase>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </IconBase>
  );
}

export function RoomIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4.5 20V9.5l7.5-5 7.5 5V20" />
      <path d="M8.5 20v-6h7v6" />
    </IconBase>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.8V12l3 2" />
    </IconBase>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 19c8.5-.3 13.5-5.3 14-14-8.7.5-13.7 5.5-14 14Z" />
      <path d="M5 19 15.5 8.5" />
    </IconBase>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 3.5v3" />
      <path d="M17 3.5v3" />
      <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
      <path d="M4 10h16" />
    </IconBase>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.2 2.2 2.2 4.8-5" />
    </IconBase>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8.5 6.5 10 4.5h4l1.5 2H19a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2h3.5Z" />
      <circle cx="12" cy="13" r="3.5" />
    </IconBase>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m9 5 7 7-7 7" />
    </IconBase>
  );
}

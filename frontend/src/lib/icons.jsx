import {
  ChatCircleDots, Brain, PaintBrush, RocketLaunch, Code,
  Cpu, ShieldCheck, Stack, PlugsConnected, ChartLineUp,
  GitBranch, Lock, Globe, ShoppingBagOpen, Heartbeat,
  Bank, GraduationCap, Buildings, TruckTrailer,
  AirplaneTakeoff, FilmSlate, Sparkle, Briefcase,
} from "@phosphor-icons/react";

export const ICONS = {
  chat: ChatCircleDots,
  brain: Brain,
  paint: PaintBrush,
  rocket: RocketLaunch,
  code: Code,
  cpu: Cpu,
  shield: ShieldCheck,
  stack: Stack,
  plug: PlugsConnected,
  chart: ChartLineUp,
  git: GitBranch,
  lock: Lock,
  globe: Globe,
  shop: ShoppingBagOpen,
  heart: Heartbeat,
  bank: Bank,
  edu: GraduationCap,
  building: Buildings,
  truck: TruckTrailer,
  plane: AirplaneTakeoff,
  film: FilmSlate,
  sparkle: Sparkle,
  briefcase: Briefcase,
};

export const Icon = ({ name, ...props }) => {
  const C = ICONS[name] || Briefcase;
  return <C {...props} />;
};

export const ICON_KEYS = Object.keys(ICONS);

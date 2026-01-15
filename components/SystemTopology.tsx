import React, { useRef } from "react";
import { cn } from "../lib/utils";
import { AnimatedBeam } from "./ui/animated-beam";
import { User, Server, Globe, Shield, Zap, Database } from "lucide-react";
import { THEME } from "../types";

export function SystemTopology({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const gatewayRef = useRef<HTMLDivElement>(null);
  const service1Ref = useRef<HTMLDivElement>(null);
  const service2Ref = useRef<HTMLDivElement>(null);
  const service3Ref = useRef<HTMLDivElement>(null);
  const dbRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-linen border border-black dark:border-dust-grey shadow-card",
        className,
      )}
      ref={containerRef}
    >
      <div className="flex size-full flex-col items-center justify-between p-4 md:flex-row md:items-stretch md:gap-10 md:p-8">
        {/* User Node */}
        <div className="flex flex-col justify-center">
          <div ref={userRef} className="z-10 flex size-12 items-center justify-center rounded-full border-2 border-dust-grey bg-parchment shadow-sm">
            <User className="size-6 text-foreground" />
          </div>
          <span className="mt-2 text-xs font-bold text-foreground-muted text-center">Users</span>
        </div>

        {/* Gateway Node */}
        <div className="flex flex-col justify-center">
          <div ref={gatewayRef} className="z-10 flex size-16 items-center justify-center rounded-2xl border-2 border-dust-grey bg-parchment shadow-sm relative">
             <Globe className="size-8 text-foreground" />
             <div className="absolute -top-1 -right-1 size-3 bg-green-500 rounded-full border-2 border-linen animate-pulse" />
          </div>
          <span className="mt-2 text-xs font-bold text-foreground-muted text-center">Gateway</span>
        </div>

        {/* Services Column */}
        <div className="flex flex-col justify-center gap-6">
          <div ref={service1Ref} className="z-10 flex size-10 items-center justify-center rounded-lg border-2 border-dust-grey bg-parchment shadow-sm">
             <Shield className="size-5 text-foreground" />
          </div>
          <div ref={service2Ref} className="z-10 flex size-10 items-center justify-center rounded-lg border-2 border-dust-grey bg-parchment shadow-sm">
             <Server className="size-5 text-foreground" />
          </div>
           <div ref={service3Ref} className="z-10 flex size-10 items-center justify-center rounded-lg border-2 border-dust-grey bg-parchment shadow-sm">
             <Zap className="size-5 text-foreground" />
          </div>
        </div>

        {/* Database Node (Optional Extension) */}
        <div className="hidden lg:flex flex-col justify-center">
           <div ref={dbRef} className="z-10 flex size-14 items-center justify-center rounded-xl border-2 border-dust-grey bg-parchment shadow-sm">
             <Database className="size-7 text-foreground" />
           </div>
           <span className="mt-2 text-xs font-bold text-foreground-muted text-center">Data</span>
        </div>
      </div>

      {/* Beams */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={userRef}
        toRef={gatewayRef}
        duration={3}
        gradientStartColor={THEME.foreground}
        gradientStopColor={THEME.almondSilk}
      />
      
      {/* Fan out */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={gatewayRef}
        toRef={service1Ref}
        duration={3}
        gradientStartColor={THEME.foreground}
        gradientStopColor={THEME.almondSilk}
        curvature={20}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={gatewayRef}
        toRef={service2Ref}
        duration={3}
        gradientStartColor={THEME.foreground}
        gradientStopColor={THEME.almondSilk}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={gatewayRef}
        toRef={service3Ref}
        duration={3}
        gradientStartColor={THEME.foreground}
        gradientStopColor={THEME.almondSilk}
        curvature={-20}
      />

       {/* DB Connections */}
       <AnimatedBeam
        containerRef={containerRef}
        fromRef={service1Ref}
        toRef={dbRef}
        duration={4}
        reverse
        pathOpacity={0.1}
        gradientStartColor={THEME.dustGrey}
        gradientStopColor={THEME.foregroundMuted}
        curvature={20}
      />
       <AnimatedBeam
        containerRef={containerRef}
        fromRef={service2Ref}
        toRef={dbRef}
        duration={4}
        reverse
        pathOpacity={0.1}
        gradientStartColor={THEME.dustGrey}
        gradientStopColor={THEME.foregroundMuted}
      />
    </div>
  );
}
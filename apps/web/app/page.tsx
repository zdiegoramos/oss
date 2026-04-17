"use client";

import { Wireframe } from "@oss/ui/components/wireframe";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<Wireframe>
			<main className="mx-auto mt-6 max-w-prose px-[4lvw] lg:px-0">
				<div className="flex items-center justify-between">
					<h1 className="font-bold text-2xl">Diego Ramos</h1>
					<Image
						alt="Logo"
						className="size-7"
						height={512}
						src="/logo.png"
						width={512}
					/>
				</div>
				<p className="mb-4">Full-Stack Engineer</p>
				<div className="mb-6 flex justify-between gap-4">
					<div className="flex gap-4">
						<Link
							className="underline"
							href="https://github.com/diegoramoz"
							target="_blank"
						>
							GitHub
						</Link>
						<Link
							className="underline"
							href="https://linkedin.com/in/ramoz"
							target="_blank"
						>
							LinkedIn
						</Link>
						<Link
							className="underline"
							href="https://youtube.com/@diegoramozdev"
							target="_blank"
						>
							YouTube
						</Link>
						<Link
							className="underline"
							href="https://x.com/zdiegoramos"
							target="_blank"
						>
							X
						</Link>
					</div>
					<Link
						className="underline"
						href="mailto:diego@ramoz.dev"
						target="_blank"
					>
						Contact Me
					</Link>
				</div>

				<div className="mb-12">
					<div className="mb-6">
						<div className="mb-2 font-bold text-lg">PROJECTS</div>
						<div className="mb-6">
							<div className="mb-2 font-bold">
								<Link
									className="underline"
									href="https://github.com/diegoramoz/oss"
									target="_blank"
								>
									AI Invoice Scanner
								</Link>{" "}
								- April 2026
							</div>
							<p className="mb-4">
								A fully functional demo of an AI invoice scanner. Users submit
								their invoices on{" "}
								<Link
									className="underline"
									href="https://finance.ramoz.dev"
									target="_blank"
								>
									finance.ramoz.dev
								</Link>{" "}
								and an{" "}
								<Link
									className="underline"
									href="https://ollama.com"
									target="_blank"
								>
									ollama
								</Link>{" "}
								vision LLM extracts structured data from it. Turning pdfs/images
								into a queryable database.
							</p>
							<p className="mb-4">
								This setup achieves private inference because the LLM runs on a
								local machine, which is exposed to the internet using a{" "}
								<Link
									className="underline"
									href="https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/"
									target="_blank"
								>
									Cloudflare Tunnel
								</Link>{" "}
								+ Zero Trust Access.
							</p>
							<a href="/finance.gif" rel="noopener" target="_blank">
								<Image
									alt="AI Invoice Scanner demo"
									className="rounded-md"
									height={450}
									loading="eager"
									src="/finance.gif"
									unoptimized
									width={800}
								/>
							</a>
						</div>
						<div className="mb-6">
							<div className="mb-2 font-bold">
								<Link
									className="underline"
									href="https://github.com/diegoramoz/oss"
									target="_blank"
								>
									Interactive 3D Flower Visualizer
								</Link>{" "}
								- Dec 2025
							</div>
							<p className="mb-4">
								Built a parametric 3D flower renderer in Next.js using p5.js and
								TypeScript. Features customizable flower geometry, adaptive mesh
								resolution during interaction for smooth performance,
								URL-encoded shareable presets via compact query strings.
							</p>
							<a href="/flower.gif" rel="noopener" target="_blank">
								<Image
									alt="AI Invoice Scanner demo"
									className="rounded-md"
									height={450}
									src="/flower.gif"
									unoptimized
									width={800}
								/>
							</a>
						</div>
						{/* <div className="mb-6">
            <div className="mb-2 font-bold">
              <Link
                className="underline"
                href="https://github.com/diegoramoz/oss"
                target="_blank"
              >
                Frontend Templates and Components
              </Link>{" "}
              - April 2026
            </div>
            <p className="mb-4">
              A frontend component showcase with components and templates for
              forms, tables, and layouts. The templates are built with best
              practices in mind, including accessibility, responsiveness, and
              performance.
            </p>
            <p className="mb-4">
              Built with Next.js 16, Tailwind CSS, shadcn/ui + Base UI, TanStack
              Form, TanStack Table, Zod
            </p>
          </div> */}
						<div className="mb-6">
							<div className="mb-2 font-bold">
								<Link
									className="underline"
									href="https://github.com/diegoramoz/wireframe"
								>
									Wireframe
								</Link>{" "}
								- Dec 2025
							</div>
							<p className="mb-4">
								A React component system for building fixed/sticky navigation
								layouts with automatic content spacing. Define your navbar and
								sidebar dimensions once, and the content area adjusts
								automatically.
							</p>
							<Link
								className="mb-4"
								href="/wireframe/playground"
								target="_blank"
							>
								<Image
									alt="Wireframe demo"
									className="rounded-md"
									height={450}
									src="/wireframe.gif"
									unoptimized
									width={800}
								/>
							</Link>
						</div>
					</div>
					<div className="mb-6">
						<div className="mb-2 font-bold text-lg">EXPERIENCE</div>
						<div className="mb-6">
							<div className="mb-2 font-bold">
								<Link className="underline" href="https://hazloya.app">
									Hazlo Ya
								</Link>
								- Senior Full-Stack Engineer, Oct 2025 - Present
							</div>
							<p className="mb-4">
								A B2B marketplace where businesses post jobs and pre-verified
								suppliers bid to deliver them. Clients compare quotes, check
								ratings, and award work in-app, while the platform&apos;s
								unified e-invoicing engine sets the national billing standard.
							</p>
							<p className="mb-4">
								Built with TypeScript, Next.js (with PWA support), Planetscale
								(MySQL), and deployed on Vercel.
							</p>
						</div>
						<div className="mb-6">
							<div className="mb-2 font-bold">
								Gaias Labs - Senior Full-Stack Engineer, Mar 2024 - Oct 2025
							</div>

							<p className="mb-4">
								RACE is game available on Base chain. Users play by depositing
								ETH for one of four hamsters before they race. The hamsters are
								AI agents that get better over time as they race. The races are
								the result of the execution of a smart contract function.
							</p>

							<div className="mb-4">
								<div className="mb-2 font-bold">Frontend contributions</div>
								<ul className="list-inside list-disc space-y-1.5">
									<li>
										Made RACE installable as a PWA and compatible with
										Farcaster, Base, and Telegram Mini Apps.
									</li>
									<li>
										Detected a critical security vulnerability with Privy
										authentication in our frontend and patched it.
									</li>
									<li>
										Created a referral system with which tens of thousands of
										users were referred.
									</li>
								</ul>
							</div>
							<div className="mb-4">
								<div className="mb-2 font-bold">Management contributions</div>
								<ul className="list-inside list-disc space-y-1.5">
									<li>
										Conducted interviews to hire a frontend engineer and tutored
										two frontend engineers (Next.js, Typescript).
									</li>
									<li>
										Provided design and engineering patterns, including the use
										of TailwindCSS and shadcn-ui to ensure a smooth development
										between all team members.
									</li>
								</ul>
							</div>
							<div className="mb-4">
								<div className="mb-2 font-bold">Backend contributions</div>
								<ul className="list-inside list-disc space-y-1.5">
									<li>
										Created a MySQL database with 57 tables using Drizzle ORM
										and deployed it to Planetscale.
									</li>
									<li>
										Created 88 endpoints to handle transactions on Base, serve
										user data, authenticate, perform user and admin actions,
										handle webhooks from third party services, and handle cron
										jobs.
									</li>
									<li>
										Deployed a Linux server (Ubuntu) on DigitalOcean to manage
										Node.js workers and cron jobs.
									</li>
									<li>
										Implemented parallel UserOps to execute multiple
										transactions at a time.
									</li>
									<li>
										Created a job queue with BullMQ to update the players&apos;
										data in real time based on blockchain activity.
									</li>
									<li>
										Created strongly typed tRPC endpoints that significantly
										reduced development time by providing thorough errors and
										automatically documenting all endpoints through type
										inference.
									</li>
									<li>
										Created a point based, reward mechanism. Once a week the
										points could be redeemed as ERC-20 tokens.
									</li>
									<li>
										Created in-app ERC-20-ETH swap using the 0x API. The
										transaction was bundled such that the approval and swap
										transactions for an ERC-20 happened with a single button
										press.
									</li>
								</ul>
							</div>
						</div>
						<div className="mb-6">
							<div className="mb-2 font-bold">
								Momentum Labs - Full-Stack Engineer, Mar 2023 - Oct. 2023
							</div>
							<ul className="list-inside list-disc space-y-1.5">
								<li>
									Created editable UI design systems with TailwindCSS and
									TypeScript which serve as a starting point or as plug-n-play
									components for any React application.
								</li>
							</ul>
						</div>
						<div className="mb-6">
							<div className="mb-2 font-bold">
								Uneven Labs, Cocoa, Fl - Frontend Engineer, Oct. 2021 - Oct.
								2022
							</div>
							<ul className="list-inside list-disc space-y-1.5">
								<li>
									Created the Reservoir Market, an open source NFT marketplace
									built on the Reservoir Protocol.
								</li>
								<li>
									Contributed to ReservoirKit, a React package that makes it
									easy to add buying NFTs into a dApp.
								</li>
								<li>
									Created the Reservoir Client SDK package. It contains
									functions to interact with the Reservoir Router API.
								</li>
								<li>
									Provided technical support to developers who use the Reservoir
									Market.
								</li>
								<li>Served as an assistant to a Solidity engineer.</li>
							</ul>
						</div>
					</div>
					<div>
						<div className="mb-2 font-bold text-lg">EDUCATION</div>
						<div className="mb-2 font-bold">
							NJIT, Newark, NJ - Bachelor&apos;s Degree in Electrical
							Engineering (Computer Systems), 2019{" "}
						</div>
						<ul className="list-inside list-disc space-y-1.5">
							<li>
								Created finite state machines and implemented the MIPS RISC
								architecture in FPGAs using VHDL.
							</li>
							<li>Programmed microprocessors using C and Assembly language.</li>
						</ul>
					</div>
				</div>
			</main>
		</Wireframe>
	);
}

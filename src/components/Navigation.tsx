import React from 'react'
import { NavLink } from 'react-router-dom'

import MobileNavigation from './MobileNavigation'
import { NAV_LINKS } from '../constants'

export default function Navigation() {
	const [isEarnOpen, setEarnOpen] = React.useState(false)

	const openEarn = React.useCallback(() => {
		if (!isEarnOpen) {
			setEarnOpen(true)
		}
	}, [isEarnOpen])

	const closeEarn = React.useCallback(() => {
		if (isEarnOpen) {
			setEarnOpen(false)
		}
	}, [isEarnOpen])

	const activeLinkClasses =
    'bg-gradient-to-b from-umami-pink to-umami-purple bg-clip-text text-transparent'

	const earnLinks = React.useMemo(() => {
		return isEarnOpen ? (
			<div className="absolute left-[-50%] top-[100%] bg-gradient-to-b from-umami-pink to-umami-purple p-[1px] mt-2 rounded-md">
				<div className="bg-black rounded-md py-2 px-4 text-lg">
					<ul className="text-center">
						{NAV_LINKS.earn.map(({ label, path }) => (
							<li key={path}>
								<NavLink
									to={path}
									className={(isActive) =>
										`${isActive ? activeLinkClasses : ''} hover:underline`
									}
								>
									{label}
								</NavLink>
							</li>
						))}
					</ul>
				</div>
			</div>
		) : null
	}, [isEarnOpen])

	return (
		<div className="w-full px-4">
			<div className="w-full max-w-6xl m-auto flex items-center justify-between h-[80px]">
				<strong className="font-display text-4xl text-white drop-shadow-[1px_1px_rgb(0,0,0,1)] uppercase tracking-[1rem]">
          Umami
				</strong>

				<div className="md:hidden">
					<MobileNavigation />
				</div>

				<div className="hidden md:block">
					<nav>
						<ul className="flex font-display text-2xl uppercase">
							<li className="mr-4">
								<NavLink
									to="/app"
									className={(isActive) =>
										`${isActive ? activeLinkClasses : ''} hover:underline`
									}
								>
                  Home
								</NavLink>
							</li>

							<li>
								<div className="relative">
									<button
										type="button"
										className={`${
											isEarnOpen ? activeLinkClasses : 'text-white'
										} hover:underline uppercase`}
										onClick={isEarnOpen ? closeEarn : openEarn}
									>
                    Earn
									</button>
									{earnLinks}
								</div>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</div>
	)
}

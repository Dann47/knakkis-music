import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sun, Moon, Menu, X, Settings } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { Disclosure } from '@headlessui/react';

const navigation = [
  { name: 'About', to: '/about' },
  { name: 'Contact', to: '/contact' },
];

export default function Navigation() {
  const { isDark, toggle } = useTheme();
  const { user } = useAuth();

  return (
    <Disclosure as="nav" className="fixed w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-nav">
      {({ open }) => (
        <>
          <div className="container mx-auto px-4">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex items-center">
                <NavLink 
                  to="/" 
                  className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent hover:scale-105 transition-transform"
                >
                  Knakkis
                </NavLink>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) =>
                      `text-sm font-medium transition-all hover:scale-105 ${
                        isActive
                          ? 'text-purple-600 dark:text-purple-400'
                          : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                {user ? (
                  <NavLink
                    to="/config"
                    className={({ isActive }) =>
                      `text-sm font-medium transition-all hover:scale-105 flex items-center space-x-1 ${
                        isActive
                          ? 'text-purple-600 dark:text-purple-400'
                          : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                      }`
                    }
                  >
                    <Settings size={16} />
                    <span>Config</span>
                  </NavLink>
                ) : (
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `text-sm font-medium px-4 py-2 rounded-full transition-all hover:scale-105 ${
                        isActive
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-600/10 text-purple-600 dark:text-purple-400 hover:bg-purple-600/20'
                      }`
                    }
                  >
                    Login
                  </NavLink>
                )}
                <button
                  onClick={toggle}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-all hover:scale-110"
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? (
                    <Sun size={20} className="text-yellow-500" />
                  ) : (
                    <Moon size={20} className="text-purple-600" />
                  )}
                </button>
              </div>

              {/* Mobile Controls */}
              <div className="flex md:hidden items-center space-x-2">
                <button
                  onClick={toggle}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? (
                    <Sun size={20} className="text-yellow-500" />
                  ) : (
                    <Moon size={20} className="text-purple-600" />
                  )}
                </button>
                <Disclosure.Button className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  {open ? (
                    <X size={24} className="text-purple-600 dark:text-purple-400" />
                  ) : (
                    <Menu size={24} className="text-purple-600 dark:text-purple-400" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <Disclosure.Panel className="md:hidden animate-slide-up">
            <div className="space-y-1 px-4 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={NavLink}
                  to={item.to}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-purple-600/10 text-purple-600 dark:text-purple-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-purple-600/10 hover:text-purple-600 dark:hover:text-purple-400'
                    }`
                  }
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              {user ? (
                <Disclosure.Button
                  as={NavLink}
                  to="/config"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-base font-medium flex items-center space-x-2 transition-colors ${
                      isActive
                        ? 'bg-purple-600/10 text-purple-600 dark:text-purple-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-purple-600/10 hover:text-purple-600 dark:hover:text-purple-400'
                    }`
                  }
                >
                  <Settings size={16} />
                  <span>Config</span>
                </Disclosure.Button>
              ) : (
                <Disclosure.Button
                  as={NavLink}
                  to="/login"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-purple-600/10 text-purple-600 dark:text-purple-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-purple-600/10 hover:text-purple-600 dark:hover:text-purple-400'
                    }`
                  }
                >
                  Login
                </Disclosure.Button>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
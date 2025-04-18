import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Music, Award, Users, Star } from 'lucide-react';

const milestones = [
  {
    date: '2024',
    title: 'Latest Album Release',
    description: 'Released groundbreaking album that topped charts worldwide.',
    icon: Music,
  },
  {
    date: '2023',
    title: 'World Tour',
    description: 'Completed successful world tour across 30 cities.',
    icon: Users,
  },
  {
    date: '2022',
    title: 'Grammy Award',
    description: 'Won Grammy for Best New Artist.',
    icon: Award,
  },
  {
    date: '2021',
    title: 'First Platinum Record',
    description: 'Debut album achieved platinum status.',
    icon: Star,
  },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>Knakkis | About</title>
      </Helmet>
      <div className="pt-20">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
          >
            About Knakkis
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg dark:prose-invert"
            >
              <p className="text-gray-700 dark:text-gray-300">
                Born and raised in the heart of the city, Knakkis emerged from the underground music scene
                with a unique sound that blends traditional elements with modern beats. His journey from
                local performances to international stages represents the power of authentic artistry and
                relentless dedication.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="prose prose-lg dark:prose-invert"
            >
              <p className="text-gray-700 dark:text-gray-300">
                With multiple chart-topping albums and sold-out tours, Knakkis continues to push the
                boundaries of musical innovation while staying true to his roots. His work has influenced
                a new generation of artists and earned him recognition across the industry.
              </p>
            </motion.div>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold mb-8 text-gray-900 dark:text-white"
          >
            Career Milestones
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <motion.div
                  key={milestone.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {milestone.title}
                        </h3>
                        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                          {milestone.date}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{milestone.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-12 p-6 bg-gradient-to-r from-purple-600/10 to-blue-500/10 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Vision & Future</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Looking ahead, Knakkis continues to evolve while maintaining the authentic sound that
              defines his artistry. With upcoming projects and collaborations in the works, the future
              promises even more groundbreaking music and unforgettable performances for fans worldwide.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
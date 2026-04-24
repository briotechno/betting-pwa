'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Plus, Minus, ChevronDown } from 'lucide-react'
import Footer from '@/components/layout/Footer'

type FAQ = {
  q: string
  a?: React.ReactNode
}

type Category = {
  id: string
  title: string
  faqs: FAQ[]
}

const categories: Category[] = [
  {
    id: 'registration',
    title: 'Registration and Login',
    faqs: [
      {
        q: 'Q1. How do I register?',
        a: (
          <ul className="list-disc pl-5 space-y-1 text-gray-300 text-[15px] text-justify">
            <li>Click on "Join Now"</li>
            <li>Fill out the form</li>
            <li>Enter the verification code you receive</li>
            <li>Enter your referral code (if any)</li>
            <li>Read and accept the terms and conditions</li>
            <li>Click on "Register", congratulations you are now a FairPlay Club member!</li>
          </ul>
        ),
      },
      {
        q: "Q2. I'm having trouble signing up!",
        a: (
          <>
            <p className="text-gray-300 text-[15px] text-justify">
              Our system will highlight the fields that are missing. Please verify the following:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-300 text-[15px] text-justify mt-2">
              <li>Have you filled all the mandatory fields?</li>
              <li>Is your email address a valid one?</li>
              <li>Do you have an existing account?</li>
            </ul>
            <p className="text-gray-300 text-[15px] text-justify mt-2">
              If you have cross checked all of the above and still face an issue, please report it to our Client Service team.
            </p>
          </>
        ),
      },
      {
        q: 'Q3. Forgot your password?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            Reset your password using the “Forgot Password” function below the field. Enter your registered email address. A link to reset the password will be sent to that mailbox. Enter the code into the provided field and create a new password.
          </p>
        ),
      },
      {
        q: 'Q4. How old do I have to be to be eligible for FairPlay Club membership?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            18+ adults only.
          </p>
        ),
      },
      {
        q: 'Q5. Do I need to be an Indian citizen to register on FairPlay?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            No, you can be a FairPlay Club member from anywhere in the world.
          </p>
        ),
      },
      {
        q: 'Q6. Can I open or operate an account for a friend or relative?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            No. An account can and must be accessed only by one person and the login credentials must not be shared with a second person.
          </p>
        ),
      },
      {
        q: "Q7. I'm unable to register because it says my credentials already exist. What do I do?",
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            Contact Client Services for assistance.
          </p>
        ),
      },
      {
        q: 'Q8. Can I hold more than one account on FairPlay?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            No. One user is only allowed one account and if found violating the same, all his accounts will be subject to suspension immediately.
          </p>
        ),
      },
      {
        q: 'Q9. My account got locked, Why and What do I do?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            Passwords are case sensitive and after three consecutive wrong passwords, the account will get locked. Contact Client Services for resolution of the same.
          </p>
        ),
      }
    ],
  },
  {
    id: 'general',
    title: 'General',
    faqs: [
      {
        q: 'Q1. Why Fairplay ?',
        a: (
          <>
            <p className="text-gray-300 text-[15px] text-justify">
              FairPlay is India’s biggest and most trusted betting exchange that offers a wide range of options to bet on- from maximum sports events to live casino and live card games. FairPlay offers the best odds in the market which ensures that a FairPlay Club member makes more profit on FairPlay than anywhere else in the market. FairPlay Club members avail benefits such as:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-300 text-[15px] text-justify mt-2">
              <li>300% bonus on the first deposit</li>
              <li>Frequent offers on deposits</li>
              <li>Quick payouts</li>
              <li>Exciting loyalty points based on player interaction</li>
              <li>24/7 client support</li>
            </ul>
          </>
        ),
      },
      {
        q: 'Q2. What type of games does fairPlay offer?',
        a: (
          <ul className="list-disc pl-5 space-y-1 text-gray-300 text-[15px] text-justify">
            <li>Sportsbetting (Cricket / Football / Tennis / Horse racing)</li>
            <li>Popular live dealer Casino games like Roulette, Baccarat, Andar Bahar, Dragon Tiger and Poker</li>
            <li>Progressive slot games</li>
            <li>A variety of Indian card games live such as Teenpatti, Andar Bahar, Lucky 7, 32 card poker and Amar Akbar Anthony</li>
            <li>FairPlay also offers Elections stakes</li>
            <li>Sports book: 30+ new sports including water polo, table tennis, soccer, baseball and a range of virtual games</li>
          </ul>
        ),
      },
      {
        q: 'Q3. Is FairPlay licensed and legitimate?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            FairPlay Club is licensed by the authority of Curacao and is certified to operate and offer online gambling globally.
          </p>
        ),
      },
      {
        q: 'Q4. What do I do if/when my game isn’t loading?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            Clear your browser cache, cookies and restart the internet browser!
          </p>
        ),
      },
      {
        q: 'Q5. What is the affiliate program and where can I find more information?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            Head to the FairPlay Affiliate Program page for all information regarding our affiliate program and the respective persons of contact for the same.
          </p>
        ),
      },
      {
        q: 'Q6. What happens if/ when I lose internet connectivity in the middle of a game?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            All the rounds in all games are logged and the successful bets are still valid. Please refer to FairPlay’s disconnection policy for more information.
          </p>
        ),
      },
      {
        q: 'Q7. An unknown error or a technical issue came up while playing. what should I do?',
        a: (
          <>
            <p className="text-gray-300 text-[15px] text-justify">
              Please do not panic, contact our Client Service team and provide the following information:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-300 text-[15px] text-justify mt-2">
              <li>User credentials (Email ID), game details</li>
              <li>Approximate time when the game was played (as specific as possible)</li>
              <li>Stake amount and account balance before &amp; after the game.</li>
              <li>Error message received/ reason given for the issue.</li>
              <li>A screenshot of the problem (wherever possible)</li>
            </ul>
          </>
        ),
      },
      {
        q: 'Q8. The video streaming is freezing, what do I do?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            Close any other running programs. You can also try reducing the screen resolution or resizing the browser, it’s possible a low network reception could be the problem.
          </p>
        ),
      },
      {
        q: 'Q9. The live dealer made a mistake, what now?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            In the event of a live dealer making a mistake, the round will be temporarily paused as the dealer notifies the pit boss. The players will be notified via chatbox and if an immediate resolution is not possible, the game round in question will be canceled and a refund will be processed.
          </p>
        ),
      },
      {
        q: 'Q10. I have a doubt, can I ask the dealers or the pit boss?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            No! Get in touch with our Client Service team.
          </p>
        ),
      },
      {
        q: 'Q11. Where can I find the bet limits for live casino games?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            The minimum and maximum bet limits are displayed under every table’s name.
          </p>
        ),
      },
      {
        q: 'Q12. What are Crash Games ?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            Crash Games on Fairplay bring the thrill of over 50+ games right to your fingertips. From navigating the intensity of crash games to discovering a variety of instant win experiences, our games are designed for non-stop excitement and big wins!
          </p>
        ),
      },
      {
        q: 'Q13. Will turnover be calculated on these Crash Games?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            No, turnover will not be calculated on these Crash Games.
          </p>
        ),
      },
      {
        q: "Q14. How is the conversion rate calculated in Fairplay's Crash Games?",
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            In Crash Games, the conversion rate is : 100 INR equals 1 point.
          </p>
        ),
      }
    ],
  },
  {
    id: 'bonus',
    title: 'Bonus',
    faqs: [
      {
        q: 'Q1. Do I need to make a turnover to avail every bonus?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            The mentioned turnover must be completed in order to activate the bonus. Please note that the turnover requirements are different for each bonus offered on FairPlay.
          </p>
        ),
      },
      {
        q: 'Q2. Is the bonus/ coupon transferrable?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            No, only one person can avail the bonus/ coupon once unless mentioned otherwise.
          </p>
        ),
      },
      {
        q: 'Q3. When will my bonus be credited?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            Bonus will be credited to the FairPlay wallet within 24 hours of the turnover being completed.
          </p>
        ),
      },
      {
        q: 'Q4. Are there any withdrawal charges?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            There are no charges for normal withdrawals. However, there are 3% charges for the first instant withdrawal and 5% for the rest.
          </p>
        ),
      },
      {
        q: 'Q5. What Are The Bonuses Offered By FairPlay And Their Eligibility Criteria?',
        a: (
          <>
            <ul className="list-disc pl-5 space-y-1 text-gray-300 text-[15px] text-justify">
              <li>Upto 300% bonus is awarded to every new Club member on his first deposit on FairPlay.</li>
              <li>Eligibility: 30x turnover of the amount you have deposited must be completed to unlock the bonus.</li>
              <li>Maximum Bonus you can receive for First Deposit Bonus is 50000</li>
              <li>Note-Users that have made 3 or more withdrawals in a week will not be eligible for the bonus.</li>
            </ul>

            <ul className="list-disc pl-5 space-y-1 text-gray-300 text-[15px] text-justify mt-3">
              <li>Second time lucky, only on FairPlay! Now get a 50% bonus on your second deposit.</li>
              <li>Eligibility: 15x turnover must be completed.</li>
              <li>Maximum Bonus is 50000</li>
            </ul>

            <ul className="list-disc pl-5 space-y-1 text-gray-300 text-[15px] text-justify mt-3">
              <li>Loyalty bonus stages:</li>
              <li>Silver: 3%</li>
              <li>Gold: 6%</li>
              <li>Platinum: 9%</li>
              <li>Eligibility: Based on turnover progression</li>
            </ul>

            <ul className="list-disc pl-5 space-y-1 text-gray-300 text-[15px] text-justify mt-3">
              <li>Referral Bonus: 15% on referral deposits</li>
              <li>Eligibility: 3x + 35x turnover required</li>
              <li>Max Bonus: 50000</li>
            </ul>

            <ul className="list-disc pl-5 space-y-1 text-gray-300 text-[15px] text-justify mt-3">
              <li>Gift Cards are seasonal promotional bonuses</li>
              <li>7x turnover required</li>
              <li>Valid for one week</li>
            </ul>

            <ul className="list-disc pl-5 space-y-1 text-gray-300 text-[15px] text-justify mt-3">
              <li>Coupon codes give seasonal bonuses</li>
              <li>20x turnover required</li>
              <li>One-time use only</li>
            </ul>
          </>
        ),
      },

      {
        q: 'Q6. Why was my Sportsbook bet not counted in the turnover?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            If a user places a bet worth upto 35p in the Sportsbook, it is not counted in the turnover criteria and qualifies for bonus abuse.
          </p>
        ),
      },
      {
        q: 'Q7. Are all bets in SportsBook counted for bonus turnover?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            Turnover will be considered in Sportsbook only on the bets placed above 1.35 odds.
          </p>
        ),
      },
      {
        q: 'Q8. Are all session bets counted for bonus turnover?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            Turnover on session bets will only be considered on the "NO" option.
          </p>
        ),
      },
      {
        q: 'Q9. Why did I not receive my First Deposit Bonus?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            A New User will not receive the First Deposit Bonus if the same device is used for multiple accounts. Also, users with 3+ withdrawals in a week are not eligible.
          </p>
        ),
      },
      {
        q: 'Q10. How to get the Lossback Bonus?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            Make 5+ PNL in Sportsexch/Sportsbook or 15+ PNL in Casino/Card games weekly to get up to 10% lossback.
          </p>
        ),
      },
      {
        q: 'Q11. How can I redeem my bonus?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            Bonus is split into parts. Example: ₹1000 bonus → split into 10 parts. Turnover also splits accordingly. Each part unlocks after required turnover is completed.
          </p>
        ),
      },
      {
        q: 'Q12. What is the criteria to receive the lossback bonus?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            User will receive the lossback bonus only if the amount is above ₹100.
          </p>
        ),
      },
      {
        q: 'Q13. How to get lossback bonus for live casinos',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            Lossback is credited based on loyalty tier if weekly PNL is 15+ and amount exceeds ₹100.
          </p>
        ),
      },
    ],
  },
  {
    id: 'banking',
    title: 'Banking',
    faqs: [
      {
        q: 'Q1. What are the methods to deposit money on FairPlay?',
        a: (
          <>
            <p className="text-gray-300 text-[15px]">The following methods are accepted:</p>
            <ul className="list-disc pl-5 text-gray-300 text-[15px] space-y-1 mt-2">
              <li>Net Banking (IMPS / NEFT)</li>
              <li>Crypto Transfer</li>
              <li>Payment gateways</li>
              <li>Cash transactions (contact Client Services)</li>
            </ul>
          </>
        ),
      },

      {
        q: 'Q2. What is the process of making a deposit?',
        a: (
          <>
            <a href="https://youtu.be/nPdfL6Duj34" target="_blank" className="text-blue-400 underline">
              How To Make A Deposit
            </a>
            <ul className="list-disc pl-5 text-gray-300 text-[15px] space-y-1 mt-2">
              <li>Log in to your account</li>
              <li>Click on “Wallet”</li>
              <li>Click on “Deposit”</li>
              <li>Choose payment method</li>
              <li>Enter amount and upload screenshot (for bank)</li>
              <li>Submit</li>
            </ul>
          </>
        ),
      },

      {
        q: 'Q3. What is the minimum and maximum deposit amount?',
        a: (
          <div className="text-gray-300 text-[15px]">
            <p className="mb-2">Limits depend on the selected method:</p>
            <div className="overflow-x-auto">
              <table className="w-full border text-center">
                <thead>
                  <tr>
                    <th className="border p-2">Method</th>
                    <th className="border p-2">Min</th>
                    <th className="border p-2">Max</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Payment Gateway</td>
                    <td className="border p-2">300</td>
                    <td className="border p-2">500000</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Bank Transfer</td>
                    <td className="border p-2">300</td>
                    <td className="border p-2">500000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ),
      },

      {
        q: 'Q4. What is the maximum and minimum withdrawal amount?',
        a: (
          <div className="text-gray-300 text-[15px]">
            <div className="overflow-x-auto">
              <table className="w-full border text-center">
                <thead>
                  <tr>
                    <th className="border p-2">Method</th>
                    <th className="border p-2">Min</th>
                    <th className="border p-2">Max</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Online Withdrawal</td>
                    <td className="border p-2">1000</td>
                    <td className="border p-2">No Limit</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ),
      },

      {
        q: 'Q5. What currencies are accepted on FairPlay?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            Mainly INR. We also support international cards, wallets like PayPal/Astropay, and cryptocurrency.
          </p>
        ),
      },

      {
        q: 'Q7. How do I withdraw my money from the FairPlay wallet?',
        a: (
          <>
            <a href="https://youtu.be/jNYPAMcNFKE" target="_blank" className="text-blue-400 underline">
              How To Make A Withdraw
            </a>
            <ul className="list-disc pl-5 text-gray-300 text-[15px] space-y-1 mt-2">
              <li>Log in to your account</li>
              <li>Go to Wallet</li>
              <li>Click “Withdrawal”</li>
              <li>Add bank details</li>
              <li>Verify via OTP</li>
              <li>Enter amount</li>
              <li>Submit</li>
            </ul>
          </>
        ),
      },

      {
        q: 'Q8. Is it safe to deposit and withdraw money?',
        a: (
          <p className="text-gray-300 text-[15px]">
            Yes, FairPlay uses certified and secure payment methods.
          </p>
        ),
      },

      {
        q: 'Q10. How can I cancel my withdrawal?',
        a: (
          <p className="text-gray-300 text-[15px]">
            You can cancel the withdrawal before it goes into processing.
          </p>
        ),
      },

      {
        q: 'Q11. How long does it take to process the deposit?',
        a: (
          <p className="text-gray-300 text-[15px]">
            Deposits take up to 1 hour. In case of technical issues, it may take longer.
          </p>
        ),
      },

      {
        q: 'Q12. How long does it take to process a withdrawal?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            Instant withdrawals take up to 45 minutes. If delayed, it may take up to 72 banking hours. Night requests are processed the next morning.
          </p>
        ),
      },

      {
        q: 'Q13. Can someone make a deposit on my behalf?',
        a: (
          <p className="text-gray-300 text-[15px]">
            No, third-party payments are not accepted.
          </p>
        ),
      },

      {
        q: 'Q14. Why was my withdrawal canceled?',
        a: (
          <ul className="list-disc pl-5 text-gray-300 text-[15px] space-y-1">
            <li>Betting requirements not met</li>
            <li>Incorrect banking details</li>
            <li>Bank account already linked to another account</li>
            <li>Missing KYC documents</li>
          </ul>
        ),
      },

      {
        q: 'Q16. When will I receive my bonus?',
        a: (
          <p className="text-gray-300 text-[15px]">
            Bonus is credited within 24 hours after completing turnover.
          </p>
        ),
      },

      {
        q: 'Q17. How long is the bonus valid for?',
        a: (
          <p className="text-gray-300 text-[15px]">
            Bonus is valid for 21 days.
          </p>
        ),
      },

      {
        q: 'Q18. Deposit failed but money deducted. What should I do?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            If transaction fails at gateway, refund is processed by them within up to 14 banking days.
          </p>
        ),
      },

      {
        q: 'Q19. Why was my withdrawal withheld?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            If no bets are placed after deposit, FairPlay may withhold up to 100% of the amount.
          </p>
        ),
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy and Security',
    faqs: [
      {
        q: 'Q1. Is FairPlay secure?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            Yes, FairPlay is absolutely secure. It follows strict policies to safeguard user privacy. All user data is encrypted to ensure confidentiality.
          </p>
        ),
      },
      {
        q: 'Q2. Are FairPlay’s games fair?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            Yes, FairPlay’s games and odds are transparent and fair. Odds are based on player activity, and outcomes are generated using certified RNG (Random Number Generator) systems to ensure fairness.
          </p>
        ),
      },
      {
        q: 'Q3. Does FairPlay use cookies?',
        a: (
          <p className="text-gray-300 text-[15px] text-justify">Yes, FairPlay may use cookies to provide the best gaming experience to our players. </p>
        )
      },
      {
        q: 'Q4. What is my personal information used for?',
        a: (
          <ul className="list-disc pl-5 space-y-1 text-gray-300 text-[15px] text-justify">
            <li>To create your personal FairPlay account</li>
            <li>Deposit/ withdrawal validation</li>
            <li>Identity verification process</li>
            <li>To prevent identity theft ie, to prevent third party fraud</li>
            <li>To keep you updated with latest information related to FairPlay</li>
          </ul>
        )
      },
    ],
  },
  {
    id: 'sports',
    title: 'SportsExch',
    faqs: [
      {
        q: "Q1. What is sports betting?",
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            Wagering on the outcome of a sport based on logical calculations or luck, predicting sports events results is referred to as Sports Betting. You can choose from a range of sports such as cricket, football, tennis, horse racing and many more in the pipeline.
          </p>
        )
      },
      {
        q: "Q2. Can I place my bets online?",
        a: (
          <p className="text-gray-300 text-[15px] text-justify">
            Yes! FairPlay has brought easy, accessible sports betting within the reach of every gambling enthusiast looking for a trustworthy option to place their bets with.
          </p>
        )
      },
      {
        q: "Q3. How do I place a bet?",
        a: (
          <ul className="list-disc pl-5 space-y-1 text-gray-300 text-[15px] text-justify">
            <li>Open the ‘SportsExch’ tab.</li>
            <li>Select the game and the match.</li>
            <li>Click on the odd numbers corresponding to the selected outcome for that bet.</li>
            <li>Enter your stake.</li>
            <li>Double check the details before clicking on the “Place Bet” button.</li>
          </ul>
        )
      },
      {
        q: "Q4. What is the meaning of back and lay?",
        a: (
          <>
            <a href="https://www.youtube.com/watch?v=4LRuCo_s2xc&feature=youtu.be" target="_blank" className="text-blue-400 underline">
              How To Place A Bet
            </a>
            <p className="text-gray-300 text-[15px] text-justify">
              Back is when you are betting on the team to win. A Lay bet is when you’re betting on the team to lose.
            </p>
          </>
        )
      }
    ],
  },
]

export default function FAQsPage() {
  // Track which category accordion is open (-1 = first open by default)
  const [openCategory, setOpenCategory] = useState<string>('registration')
  // Track which question is expanded within a category
  const [openQuestion, setOpenQuestion] = useState<string>('registration-0')

  const toggleCategory = (id: string) => {
    setOpenCategory(prev => prev === id ? '' : id)
    setOpenQuestion('') // close any open Q when switching categories
  }

  const toggleQuestion = (key: string) => {
    setOpenQuestion(prev => prev === key ? '' : key)
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Page Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] border-b border-white/10 sticky top-0 z-10">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          <ChevronLeft size={22} />
        </Link>
        <h1 className="text-white text-[15px] font-bold tracking-widest uppercase">FAQs</h1>
      </div>

      {/* Category Accordions */}
      <div className="max-w-5xl pl-[30px] pr-4 py-6 pb-16 space-y-4">
        {categories.map((category) => {
          const isCatOpen = openCategory === category.id

          return (
            <div key={category.id} className="overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors border border-white/10 rounded-md bg-[#1a1a1a]`}
              >
                <span className={`text-[16px] font-bold ${isCatOpen ? 'text-[#e8612c]' : 'text-white'}`}>
                  {category.title}
                </span>
                <span className="text-gray-400">
                  {isCatOpen ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>

              {/* Category Content — list of sub-questions */}
              {isCatOpen && (
                <div className="mt-2 space-y-1">
                  {category.faqs.map((faq, qi) => {
                    const qKey = `${category.id}-${qi}`
                    const isQOpen = openQuestion === qKey

                    return (
                      <div key={qKey} className="flex flex-col">
                        {/* Question Row */}
                        <button
                          onClick={() => toggleQuestion(qKey)}
                          className={`w-full flex items-center justify-between px-0 py-3 text-left transition-colors group bg-transparent border-b border-white/5 last:border-0`}
                        >
                          <span className={`text-[15px] font-medium leading-snug flex-1 pr-4 ${isQOpen ? 'text-white font-bold' : 'text-gray-200'
                            }`}>
                            {faq.q}
                          </span>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${isQOpen ? 'bg-[#e8612c]' : 'bg-[#e8612c]/80'
                            }`}>
                            <ChevronDown
                              size={14}
                              className={`text-white transition-transform duration-200 ${isQOpen ? 'rotate-180' : ''}`}
                            />
                          </div>
                        </button>

                        {/* Answer - Boxed with Orange Border as per reference */}
                        {isQOpen && faq.a && (
                          <div className="mt-2 mb-4 p-5 rounded-lg border border-[#e8612c]/40 bg-white/[0.02]">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <Footer />
    </div>
  )
}

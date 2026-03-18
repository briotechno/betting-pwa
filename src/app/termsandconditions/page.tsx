import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

type Section = {
  id: string
  title: string
  subsections?: { title: string; content: (string | { type: 'ol' | 'ul'; items: string[] })[] }[]
  content?: (string | { type: 'ol' | 'ul'; startType?: string; items: string[] })[]
}

const sections: Section[] = [
  {
    id: 'I',
    title: 'I. fairplay',
    content: [
      `By subscribing/registering to/on our fairplay website, and its sub-domains (collectively referred to as "fairplay site") and/or any services including, registering and playing betting games, participating in betting contests and tournaments, provided on the fairplay site, you agree that you have read, understood and have agreed to be bound by this Terms and Conditions, regardless of how you subscribe to or use the services.`,
      `Please note that this Privacy Policy will be agreed between you and fairplay. ('We', 'Us' or 'Our', as appropriate). This Privacy Policy is an integrated part of fairplay's Terms and Conditions. We may periodically make changes to this Privacy Policy and will notify you of these changes by posting the modified terms on our platforms. We recommend that you revisit this Privacy Policy regularly. Please read the Terms carefully and if you do not accept the Terms, do not use, visit or access any part (including, but not limited to, sub-domains, source code and/or website APIs, whether visible or not) of the fairplay site. The Terms shall also apply to all telephone betting and betting or gaming via mobile devices including downloadable applications to a mobile device (as if references to your use of the Website were references to your use of our telephone betting and/or mobile devices betting facilities). "We", "us", "our", "fairplay" shall mean Win Ventures NV and/or any of its affiliated entities. For the purpose of these Terms and Conditions, wherever the context so require "you" or "your" or "User" or "Participant" shall mean any natural or legal person who has agreed to become a member of the fairplay site by visiting the fairplay site as registered User or a person who has used the fairplay site either through browsing or otherwise. Where you play any game, or place a bet or wager, using the Website, you accept and agree to be bound by, the Rules which apply to the applicable products available on the Website from time to time.`,
      `fairplay one stop shop for leisure gambling games including Baccarat, Teen Patti, Roulette, Poker, Blackjack and sports betting through which it offers cricket based, football, tennis, horse racing based online betting games along with live casino betting. The fairplay site is neither affiliated by nor associated to any sort of private or government Sports leagues and tournaments until and unless expressly stated by fairplay. In addition to this, the fairplay app is not related and does not claim any official status with any of the official or non-official sports teams and/or sportspersons.`,
    ],
  },
  {
    id: 'II',
    title: 'II. User Registration',
    content: [
      `To participate in fairplay activities, you must register by creating a fairplay club account by providing your true information. In the event you wish to play on the fairplay site you shall create an account with us. You shall do so after completing the registration process by:`,
      { type: 'ol', items: ['Providing true, accurate, correct and complete information as prompted by the applicable registration form.', 'Maintaining and updating true, accurate, correct and complete information provided by you during the registration process.'] },
      `You shall be required to choose a username and password. You shall be solely responsible for maintaining the confidentiality of your account username and password. You shall be solely responsible for the registration information provided by you during submissions and the consequences of posting or publishing them. fairplay is only acting as a repository of data and makes no guarantee as to the validity, accuracy, or legal status of any information / submissions.`,
      `If, at any time, fairplay believes that your account and password is being misused in any manner, or that the information provided by you during the above stated registration process is not true, inaccurate or incomplete, then fairplay reserves the right to terminate/cancel or suspend your account and block your access to the fairplay site. You shall be solely and exclusively responsible for any and/or all the activities that are carried through your account. You agree to notify fairplay of any unauthorized use of your account and/or any breach of security please contact us at chat. fairplay shall not be liable for any loss that you may incur as a result of another person(s) using your account username and/or password and / or your failure to comply with this section.`,
      `If fairplay charges you a platform fee (facilitation fee) in respect of any fairplay services, fairplay shall, without delay, refund such platform fee in the event of suspension and/or termination of your account or fairplay services on account of any fault on the part of fairplay. It is hereby clarified that no refund shall be payable if such suspension and/or termination is affected due to any breach or failure to adhere any of these Terms and Conditions, Privacy Policy and/or any other rules by the you, the User, or a person(s) accessing your account by using your username and password; or any circumstances beyond the reasonable control of fairplay.`,
    ],
  },
  {
    id: 'III',
    title: 'III. Registration and Participants',
    content: [
      `The games/tournaments/contests available on the fairplay site are open only to persons aged eighteen (18) years or above at the date of usage and/or registration, who are participating from jurisdiction where gaming on fairplay is permitted. Employees of fairplay, Play Ventures NV, their associated, affiliated and subsidiary companies and their families, agents, game sponsors, and any person connected with fairplay are excluded from participating in the game and/or winning a prize. By taking part in a game on the fairplay site, Users/Participants warrant that all information submitted by them is true, accurate and complete. Users/Participants who wish to participate shall have a valid email address. In order to register for the betting games, Users/Participants are required to accurately provide the following information:`,
      { type: 'ul', items: ['Full Name', 'E-mail address', 'Password', 'Gender', 'Date of birth'] },
      `As part of the registration process, we may supply your information details to authorized credit reference agencies to confirm your identity and payment card details. You agree that we may process such information in connection with your registration. Participants may open only one account; in case we identify any customer with more than one account we reserve the right to treat any such accounts as one joint account.`,
    ],
  },
  {
    id: 'IV',
    title: 'IV. Account Details',
    content: [
      `Fairplay allows all its users to choose their own Username and Password combination for their account. Users must keep this information secret and confidential as you are responsible for all bets/wagers placed on your account and any other activities taking place on your account. Bets will stand if your Username and Password have been entered correctly or if your account has been accessed via Touch ID, Fingerprint log in, Face ID, Passcode, subject to there being sufficient funds in the account.`,
      `If, at any time, you feel a third party is aware of your Username, Password you should change it immediately via the Fairplay site. In case you forget part or all of your combination, contact us at chat or avail the Chat support made available for Users on the Platform.`,
      `If you nominate another person as an authorized user of your account, you shall be responsible for all transactions such person makes using the relevant account details. Should you lose your account details or feel that someone else may have your account details, please contact us at chat.`,
    ],
  },
  {
    id: 'V',
    title: 'V. Suspension and Closure',
    content: [
      `Reach out to us at chat in case of closure of accounts. Any negative balance on your behalf will be immediately due and payable to Fairplay, and your account will not be closed until the relevant amount owed to Fairplay is paid in full. Fairplay reserves the right to close or suspend your account at any time and for any reason including any violation of laws. Without limiting the preceding sentence, Fairplay shall be entitled to close or suspend your account if:`,
      `i. Fairplay considers that you have used the Website in a fraudulent manner or for illegal and/or unlawful or improper purposes; ii. Fairplay considers that you have used the Website in an unfair manner, have deliberately cheated or taken unfair advantage of Fairplay or any of its customers or if your account is being used for the benefit of a third party; iii. Fairplay considers that you have opened or are using any additional accounts to conceal your activity; iv. Fairplay considers that you have deliberately provided incomplete or inaccurate information when registering; v. Fairplay is requested to do so by the police, any governmental or other regulatory authority; vi. Fairplay considers that any of the events referred to in (i) to (iv) above may have occurred or are likely to occur; vii. you become bankrupt; viii. you are in breach of Fairplay's Responsible Gaming Policy; ix. your account is deemed to be dormant and its balance is, or reaches zero.`,
      `If Fairplay closes or suspends your account for any of the reasons referred to in (i) to (viii) above, you shall be liable for any and all claims, losses, liabilities, damages, costs and expenses incurred or suffered by Fairplay arising therefrom and shall indemnify and hold Fairplay harmless on demand for such Claims.`,
    ],
  },
  {
    id: 'VI',
    title: 'VI. Finances',
    subsections: [
      {
        title: 'A. Deposits And Wagers',
        content: [
          `You may only bet/wager with the amount of cleared funds held in your account. Accordingly, if you want to place bets or participate in gaming, you must deposit monies into your account. By depositing funds into your account, you direct us and we agree to hold them, along with any winnings, for the sole and specific purpose of using them (i) to place your sporting and gaming stakes; and (ii) settling any fees or charges in connection with the use of our services.`,
          `For payment methods that require a specific account holder, you should only deposit funds into your gambling account from a source where you are the named account holder.`,
          `All funds that we hold for you are held in separate designated customer bank accounts to be used solely for the Purpose and the bank has acknowledged this. We must return the funds to you if they are not used for the Purpose.`,
          `You agree that we shall be entitled to retain any interest which might accrue on monies held in your Fairplay account. No credit will be offered by any employee of Fairplay, and all bets must be supported by sufficient funds in the customer account.`,
          `Fairplay does not charge for deposits made by Debit/Credit Card, however please be aware that some card issuers consider betting transactions as 'cash' payments and therefore may charge you a cash advance fee. Any and all bank charges and other chargeback fee, shall solely be the liability of the User.`,
        ]
      },
      {
        title: 'B. Withdrawals',
        content: [
          { type: 'ol', items: ['All withdrawals will be processed to the payment account from which the deposits were made. Withdrawal payments can only be made in the name of and to the registered account holder.', "For most payment types, withdrawals can be processed by clicking 'Withdraw' on the Website, subject to there being sufficient funds in your betting account. There is no set maximum withdrawal amount per day.", 'If the value of a deposit is not played through in full before a withdrawal is requested, Fairplay reserves the right to make a charge to the customer\'s account to cover all reasonable costs.', 'If the deposit method of the account is paysafecard and the value of a deposit is not played through in full before a withdrawal is requested, Fairplay reserves the right to request a receipt showing proof of purchase.'] }
        ]
      },
      {
        title: 'C. Other',
        content: [
          { type: 'ul', items: ['If we incur any charge-backs, reversals or other charges in respect of your account, we reserve the right to charge you for the relevant amounts incurred.', 'You are responsible for reporting your winnings and losses to the tax and/or other authorities in your jurisdiction.'] }
        ]
      }
    ]
  },
  {
    id: 'VII',
    title: 'VII. Betting Procedures',
    subsections: [
      {
        title: 'A. Placing Bets/Wagers',
        content: [
          `It is the responsibility of the customer to ensure details of their bets/wagers are correct. Once bets/wagers have been placed they may not be cancelled by the customer. Bets can only be changed by the customer using our Edit Bet feature, where this is available. Fairplay reserves the right to cancel any bet/wager at any time.`,
          `Your funds will be allocated to bets/wagers in the order they are placed and will not be available for any other use.`,
        ]
      },
      {
        title: 'B. Bet/Wager Confirmation',
        content: [
          `Bets/wagers will not be valid if there are insufficient funds in your account.`,
          `A bet/wager that you request will only be valid once accepted by Fairplay's servers. Each valid bet/wager will receive a unique transaction code. We shall not be liable for the settlement of any bets/wagers which are not issued with a unique transaction code.`,
          `Should a dispute arise, you and Fairplay agree that the Fairplay transaction log database will be the ultimate authority in such matters.`,
        ]
      },
      {
        title: 'C. Offers',
        content: [
          `Where any term of an offer or promotion is breached or there is any evidence of a series of bets placed by a customer or group of customers, which due to enhanced payments, Free Bets, risk free bets, Bet Credits or any other promotional offer results in guaranteed customer profits irrespective of the outcome, Fairplay may reclaim the enhanced payment element of such offers and/or void any bet funded by the Free Bet or Bet Credits.`,
          `Fairplay may reclaim any bonus amount, Free Bets, Bet Credits or enhanced payments that have been awarded in error. All customer offers are limited to one per person.`,
          `Fairplay may, at any time, make minor amendments to the terms and conditions of any offer or promotion to correct typographical errors or to improve on clarity. Fairplay reserves the right to amend the terms of or cancel any customer offer or promotion at any time.`,
        ]
      },
      {
        title: 'D. Settlement and Payouts',
        content: [
          { type: 'ol', items: ['All bets and wagers are subject to the Betting Coverage provisions set out in Appendix Two to these Terms and Conditions.', 'Fairplay reserves the right to suspend a market and/or cancel any bet/wager anytime.', 'Winnings from settled bets/wagers are added to the balance of your betting account.', 'Fairplay reserves the right to withhold payment and to declare bets on an event void if we have evidence that: (i) the integrity of the event has been called into question; (ii) the price(s) or pool has been manipulated; or (iii) match rigging has taken place.', 'Where there is evidence of a series of bets each containing the same selection(s) having been placed by or for the same individual, Fairplay reserves the right to make bets void or withhold payment.', 'For events where there is no official \'off\' declared, the advertised start time of the event will be deemed the \'off\'.', 'In-Play betting - where we have reason to believe that a bet is placed after the outcome of an event is known, we reserve the right to void the bet, win or lose.', 'Where a customer gives ambiguous instructions, Fairplay reserves the right to split the number of monies staked between the potential outcomes.'] }
        ]
      }
    ]
  },
  {
    id: 'VIII',
    title: 'VIII. Use of the Fairplay Site',
    content: [
      `All materials provided on the Fairplay site, including but not limited to all information, materials, functions, text, logos, designs, graphics, images, sounds, software, documents, products and services (collectively, the "Materials"), and the selection, arrangement and display thereof, are the copyrighted works of Fairplay and/or its vendors and/or suppliers.`,
      `Subject to your compliance with these Terms and Conditions, Fairplay hereby grants you the right to access and use the Fairplay site only for personal and non-commercial purposes.`,
      `You may post/share links/images/text content on the Fairplay site on social media platforms like Facebook, Twitter, Google+, Snapchat, Instagram, YouTube or any other social media sharing platform with appropriate link-back to the original source.`,
    ],
  },
  {
    id: 'IX',
    title: 'IX. Prohibited Use and Fairplay Policy',
    subsections: [
      {
        title: 'a. Prohibited Use.',
        content: [
          `As a condition of your use of the Fairplay site, you shall not use the Fairplay site for any purpose that is unlawful or prohibited under these Terms and Conditions or under any relevant laws. You shall not display, upload, modify, publish, transmit, update or share any information on the Fairplay site that is:`,
          { type: 'ol', items: ['promoting illegal or tortuous activities or conduct that is abusive, threatening, obscene, defamatory or libelous;', 'attempting to circumvent, disable or otherwise interfere with security-related features of Fairplay;', 'using cheats, exploits, automation software, bots, hacks, mods or any other unauthorized software designed to modify or interfere with the Fairplay site;', 'using any software that intercepts, mines, or otherwise collects information about other Users;', 'interfering with, disrupting, or creating an undue burden on the Fairplay site;', 'attempting to impersonate another User or person;', 'soliciting personal information from anyone under the eighteen (18) years of age;', 'using the account, username, or password of another account holder at any time;', 'using any information obtained from the Fairplay site in order to harass, abuse, or harm another person;', 'using any unfair, misleading or deceptive content;', 'using the Fairplay site in a manner inconsistent with any applicable laws and regulations;', 'sub-license, rent, lease, sell, trade, gift, bequeath or otherwise transfer the User account;', 'access or use of a third-party account that has been transferred;', 'using the Fairplay site for any commercial purpose.'] }
        ]
      },
      {
        title: 'b. Fairplay Policy.',
        content: [
          `We at Fairplay consider the Fair play of online betting game/tournament/contest of utmost importance. In order to prevent any form of fraud or unfair play in our games/contests/tournaments or on our site — all User actions including deposits/identity verification/Betting Games/Tournaments/Contests are monitored to ensure a safe, legal and fair environment for you. Every single betting game shall be a fair individual effort. Any detection of a breach of our Fair play policy shall result in swift and serious action taken by Fairplay against the suspected User/Participant.`,
        ]
      }
    ]
  },
  { id: 'X', title: 'X. Legality', content: [`The User's/Participant's use of the Fairplay site and software is also subject to relevant legislations which apply to the User on the basis of the location from which he/she accesses the Fairplay site.`, `In case wherein detailed audits find any User/Participant to be a resident of any jurisdiction where gaming/gambling is restricted/prohibited, actions including blocking of account, account reset, account deletion or deactivation shall be initiated.`, `The User/Participant agrees that Fairplay shall not be held liable if laws applicable to the User/Participant restricts or prohibits his/her participation.`, `Fairplay makes no representations or warranties, implicit or explicit, as to the User's legal right to participate.`, `The Fairplay site and service are hosted in Curacao and are intended for and directed to Users/Participants all over the world (except where the same is prohibited under local applicable laws).`] },
  { id: 'XI', title: 'XI. User Conduct', content: [`You agree to abide by these Terms and Conditions and all other rules, regulations of the Fairplay Website and/or App. In the event you do not abide by these Terms and Conditions, Fairplay may, at its sole and exclusive discretion, take necessary remedial action, including but not limited to: (a) restricting, suspending, or terminating your access; (b) deactivating or deleting your account; or (c) refraining from awarding any prize(s) to such User.`, `You agree to provide true, accurate, current and complete information at the time of registration. You shall not register or operate more than one User account with Fairplay. Any password issued by Fairplay to you shall not be revealed to anyone else. You are responsible for the security of your device(s) and for all bets/wagers placed on your account.`] },
  { id: 'XII', title: 'XII. Participation in Contests', content: [`By entering a Contest, User/Participant agrees to be bound by these Terms and the decisions of Fairplay. Fairplay may disqualify any User/Participant from a Contest, refuse to award benefits or prizes and require the return of any prizes, if the User engages in unfair conduct, including: (a) Falsifying personal information; (b) Engaging in any type of financial fraud; (c) Colluding with any other Users; (d) Any violation of Contest rules; (e) Accumulating points through unauthorized methods such as automated bots; (f) Using automated means to obtain or access information; (g) Tampering with the administration of a Contest; (h) Spamming other Users.`] },
  { id: 'XIII', title: 'XIII. Intellectual Property', content: [`Unless otherwise stated, copyright and/or all intellectual property rights in all materials on the Fairplay site are the properties of Fairplay and are owned & controlled by us and/or by other parties that have licensed their materials to us. You shall not copy, reproduce, republish, upload, post, transmit or distribute the Fairplay site materials in any way without the prior written consent of the owner.`, `Any use of the materials other than for personal and non-commercial purposes shall be considered as commercial use. Any infringement shall be vigorously defended and pursued to the extent permitted by applicable law.`] },
  { id: 'XIV', title: 'XIV. Limitations of Liability', content: [`Users shall access the Fairplay Services provided on Fairplay voluntarily and at their own risk. Fairplay shall, under no circumstances be held responsible or liable on account of any loss or damage sustained by Users or any other person or entity during the course of access to the Fairplay Services.`, `By entering the contests and accessing the Fairplay Services, Users hereby release from and agree to indemnify Fairplay, and/or any of its directors, employees, partners, associates and licensors, from and against all liability, cost, loss or expense arising out their access to the Fairplay Services.`, `Users shall indemnify, defend, and hold Fairplay harmless from any third party claims arising from or related to such User's engagement with the Fairplay or participation in any Contest.`] },
  { id: 'XV', title: 'XV. Third Party Sites, Services and Products', content: [`Fairplay may contain links to other Internet sites owned and operated by third parties. Users' use of each of those sites is subject to the conditions, if any, posted by the sites. Fairplay does not exercise control over any Internet sites apart from Fairplay.`, `Users' correspondence, transactions/offers or related activities with third parties, including payment providers and verification service providers, are solely between the User and that third party.`] },
  { id: 'XVI', title: 'XVI. Privacy Policy', content: [`All information collected from Users, such as registration and credit card information, is subject to Fairplay's Privacy Policy which is available at Privacy Policy.`] },
  { id: 'XVII', title: 'XVII. Contacting Winners', content: [`Winners shall be contacted by Fairplay either through the e-mail address provided at the time of registration or through either Calls or Short Messaging Service (SMS) on their registered Phone Number.`, `Fairplay shall not permit a Winner to withdraw his/her prize(s)/accumulated winnings unless some government approved ID have been received and verified within the time-period stipulated by Fairplay.`] },
  { id: 'XVIII', title: 'XVIII. Verification Process', content: [`Only those Winners who successfully complete the verification process and provide the required documents within the time limit specified by Fairplay shall be permitted to withdraw/receive their accumulated winnings. Fairplay shall not entertain any claims or requests for extension of time for submission of documents.`, `Fairplay shall scrutinize all documents submitted and may, at its sole and absolute discretion, disqualify any Winner from withdrawing his accumulated winnings.`] },
  { id: 'XIX', title: 'XIX. Taxes Payable', content: [`All prizes shall be subject to withholding tax implications payable by you. Fairplay shall not be responsible for checking the laws of your jurisdiction pertaining to withholding tax. The Winners shall be responsible for payment of any other applicable taxes, including but not limited to, income tax, gift tax, etc. in respect of the prize money.`] },
  { id: 'XX', title: 'XX. Miscellaneous', content: [`The decision of Fairplay with respect to the awarding of prizes shall be final, binding and non-contestable. If it is found that a Participant playing the paid formats of the Contest(s) is a resident of any jurisdiction from where participation is prohibited, Fairplay shall disqualify such Participant.`, `If it is found that a Participant playing the paid formats of the Contest(s) is under the age of eighteen (18), Fairplay shall be entitled, at its sole and absolute discretion, to disqualify such Participant and forfeit his/her prize.`, `All prizes are non-transferable and non-refundable. Prizes cannot be exchanged / redeemed for cash or kind.`] },
  { id: 'XXI', title: 'XXI. Publicity', content: [`Acceptance of a prize by the Winner constitutes permission for Fairplay, and its affiliates to use the Winner's name, likeness, voice and comments for advertising and promotional purposes in any media worldwide without any further permissions or consents.`, `The Winners further undertake that they will be available for promotional purposes as planned and desired by Fairplay without any charge.`] },
  { id: 'XXII', title: 'XXII. Limitation of Liability', content: [`In no event shall Fairplay its officers, directors, employees, or agents, be liable to you for any direct, indirect, incidental, special, punitive, or consequential damages whatsoever resulting from any: (i) errors, mistakes, or inaccuracies of content; (ii) personal injury or property damage; (iii) any unauthorized access to or use of our secure servers; (iv) any interruption and/or cessation of transmission to or from our servers; (v) any bugs, viruses, trojan horses, or the like; (vi) any errors or omissions in any content; (vii) the disclosure of information pursuant to these Terms and Conditions or privacy policy of Fairplay.`, `You specifically acknowledge that Fairplay shall not be liable for any defamatory, offensive, or illegal conduct of any third party.`] },
  { id: 'XXIII', title: 'XXIII. Technical Failures and Disconnection Policy', content: [`It is possible that you may face disruptions, including, but not limited to errors, disconnection or inferences in communication in the Internet services, software or hardware that you have used to avail our services. Fairplay shall not be liable for any network outage or any problems/interruptions with network connectivity.`, `You agree that Fairplay shall not be held responsible and/or liable for any interruption in a Fairplay game caused at the User's end due to an incoming call, message, chat, video call or any other interruption on the mobile phone device/tablet device.`] },
  { id: 'XXIV', title: 'XXIV. Indemnity', content: [`You agree to defend, indemnify and hold harmless Fairplay, its officers, directors, employees and agents, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees) arising from: (a) your use of and access to the Fairplay site; (b) your violation of any term of these Terms and Conditions; (c) your violation of any third party right; (d) any violation of applicable law, rules, regulation, orders and ordinance.`] },
  { id: 'XXV', title: 'XXV. Governing Law and Jurisdiction', content: [`Fairplay is licensed to provide gambling services and products to you by Play Ventures NV who are sub-licensee's of the Master Gaming license issued by the Ministry of Justice, Official Decree of the Central Government of Curaçao No 365/JAZ dated August 18, 1998 No 14. Thus, the relevant and applicable laws of Curacao are to be adhered to by the users under these Terms and Conditions.`] },
  { id: 'XXVI', title: 'XXVI. Dispute Resolution', content: [`The courts or tribunals of competent jurisdiction at Curacao shall have jurisdiction to determine any and all disputes arising out of, or in connection with, the Fairplay Services.`, `In the event of any legal dispute which may arise, the party raising the dispute shall provide a written notification to the other party. On receipt of Notification, the parties shall first try to resolve the dispute through discussions. In the event the parties are unable to resolve the dispute within fifteen (15) days, the dispute shall be settled by arbitration.`, `The arbitration award will be final and binding on the Parties, and each Party will bear its own costs of arbitration and equally share the fees of the arbitrator unless the arbitral tribunal decides otherwise.`] },
  { id: 'XXVII', title: 'XXVII. Breach and Consequences', content: [`If we have evidence of a breach of our Terms and Conditions, we reserve the right in our sole discretion to: Permanently suspend and/or terminate your user account; Forfeit the balance amount left in your account; Demand and order damages for breach; Initiate steps of prosecution; Cause restriction to access our games to suspected cheaters; Bar you from playing or registering at Fairplay in the future.`, `The action taken by us will be solely due to your breach of our Terms and Conditions; the action shall be final and decisive that will be binding on you.`] },
  { id: 'XXVIII', title: 'XXVIII. Termination', content: [`We reserve the right, at our discretion, to immediately, with or without notice, suspend or terminate your registration, the Terms and Conditions and/or your access to all or any portion of the Fairplay site and/or remove any registration information or User Content from the Fairplay site.`] },
  { id: 'XXIX', title: 'XXIX. Disclaimers', content: [`To the extent permitted under law, neither Fairplay nor its parent/holding company, subsidiaries, affiliates, directors, officers, professional advisors, employees shall be responsible for the deletion, the failure to store, the mis-delivery, or the untimely delivery of any information or materials.`, `Fairplay shall make best endeavors to ensure that the Fairplay site is error-free and secure, however, neither Fairplay nor any of its partners, licensors or associates makes any warranty that the Fairplay service(s) will meet Users' requirements, will be uninterrupted, timely, secure, or error free, or that the results obtained will be accurate or reliable.`] },
  { id: 'XXX', title: 'XXX. Force Majeure', content: [`Neither party to these Terms and Conditions shall be liable for any loss and/or any failure to perform any obligation under these Terms and Conditions due to causes beyond its reasonable anticipation or control including real or potential labor disputes, governmental actions, war or threat of war, sabotage, civil unrest, demonstrations, fire, storm, flooding, explosion, earthquake, provisions or limitations of materials or resources, inability to obtain the relevant authorization, accident and defect in electricity or telecommunication network.`] },
  { id: 'XXXI', title: 'XXXI. Entire Agreement', content: [`The Terms and Conditions and Privacy Policy, as amended from time to time, constitute the entire agreement between you and Fairplay. If any provision of these Terms and Conditions is considered unlawful, void, or for any reason unenforceable by a court of competent jurisdiction, then that provision shall be deemed severable from these Terms and Conditions and shall not affect the validity and enforceability of any remaining provisions.`] },
  { id: 'XXXII', title: 'XXXII. Ability to Accept Terms and Conditions', content: [`The Terms and Conditions and Privacy Policy, as amended from time to time, constitute the entire agreement between you and Fairplay.`, `You further represent and warrant that you are not located in any of the Excluded Regions where any of the games offered on Fairplay is prohibited.`] },
  { id: 'XXXIII', title: 'XXXIII. Assignment', content: [`These Terms and Conditions, and any rights and licenses granted hereunder, may not be transferred or assigned by you, but may be assigned by Fairplay without restriction.`] },
  { id: 'XXXIV', title: 'XXXIV. Waiver', content: [`No waiver of any terms of these Terms and Conditions shall be deemed a further or continuing waiver of such term or any other term and Fairplay's failure to assert any right or provision under these Terms and Conditions shall not constitute a waiver of such right or provision.`] },
  { id: 'XXXV', title: 'XXXV. Relationship', content: [`None of the provisions of the Terms and Conditions shall be deemed to constitute a partnership or agency between you and Fairplay and you shall have no authority to bind Fairplay in any manner, whatsoever.`] },
]

function renderContent(item: string | { type: 'ol' | 'ul'; startType?: string; items: string[] }, idx: number) {
  if (typeof item === 'string') {
    return <p key={idx} className="text-gray-300 text-[13px] leading-relaxed mb-3 last:mb-0 text-justify">{item}</p>
  }
  if (item.type === 'ol') {
    return (
      <ol key={idx} className="list-decimal pl-5 mb-3 space-y-1">
        {item.items.map((li, i) => (
          <li key={i} className="text-gray-300 text-[13px] leading-relaxed text-justify">{li}</li>
        ))}
      </ol>
    )
  }
  return (
    <ul key={idx} className="list-disc pl-5 mb-3 space-y-1">
      {item.items.map((li, i) => (
        <li key={i} className="text-gray-300 text-[13px] leading-relaxed text-justify">{li}</li>
      ))}
    </ul>
  )
}

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Page Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] border-b border-white/10 sticky top-0 z-10">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          <ChevronLeft size={22} />
        </Link>
        <h1 className="text-white text-[15px] font-bold tracking-wide">Terms And Conditions</h1>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-16">
        {sections.map((section) => (
          <div key={section.id} className="mb-8">
            {/* Section Heading */}
            <h2 className="text-white text-[15px] font-bold capitalize mb-3">{section.title}</h2>

            {/* Flat content paragraphs */}
            {'content' in section && section.content?.map((item, i) => renderContent(item as string | { type: 'ol' | 'ul'; items: string[] }, i))}

            {/* Subsections (e.g. VI Finances with A,B,C) */}
            {'subsections' in section && section.subsections?.map((sub, si) => (
              <div key={si} className="mb-4 pl-1">
                <h3 className="text-white text-[14px] font-bold capitalize mb-2">{sub.title}</h3>
                {sub.content.map((item, ci) => renderContent(item as string | { type: 'ol' | 'ul'; items: string[] }, ci))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

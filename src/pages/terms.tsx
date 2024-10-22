import type { NextPage } from 'next'
import Head from 'next/head'

const SafeTerms = () => (
  <div>
    <h1>Terms and Conditions</h1>
    <p>Last updated: October 14, 2024.</p>

    <h2>1. What is the scope of the Terms?</h2>
    <p>
      These Terms and Conditions (“Terms”) become part of any contract (“Agreement”) between you (“you”, “yours” or
      “User”) and Core Contributors (“CC”, “we”, “our” or “us”) provided we made these Terms accessible to you prior to
      entering into the Agreement and you consent to these Terms. We are Altoros LLC, a limited liability company
      registered with the commercial register of Puerto Rico under company number 416164, with its registered office at
      1607 Ponce de Leon Avenue, GM-06, San Juan, PR, 00909-1803. You can contact us by writing to{' '}
      <a href="mailto:safe@protofire.io">safe@protofire.io</a>.
    </p>
    <p>
      The Agreement is concluded by using the Web App subject to these Terms. The use of our Services is only permitted
      to legal entities, partnerships and natural persons with unlimited legal capacity. In particular, minors are
      prohibited from using our Services.
    </p>
    <p>
      The application of your general terms and conditions is excluded. Your deviating, conflicting or supplementary
      general terms and conditions shall only become part of the Agreement if and to the extent that CC has expressly
      agreed to their application in writing. This consent requirement shall apply in any case, even if for example CC,
      being aware of your general terms and conditions, accepts payments by the contractual partner without
      reservations.
    </p>
    <p>
      We reserve the right to change these Terms at any time and without giving reasons, while considering and weighing
      your interests. The new Terms will be communicated to you in advance. They are considered as agreed upon if you do
      not object to their validity within 14 days after receipt of the notification. We will separately inform you about
      the essential changes, the possibility to object, the deadline and the consequences of inactivity. If you object,
      the current version of the Terms remains applicable. Our right to terminate the contract according to Clause 13
      remains unaffected.
    </p>

    <h2>2. What do some of the capitalized terms mean in the Agreement?</h2>
    <ul>
      <li>
        <strong>“Blockchain”</strong> means a mathematically secured consensus ledger such as the Ethereum Virtual
        Machine, an Ethereum Virtual Machine compatible validation mechanism, or other decentralized validation
        mechanisms.
      </li>
      <li>
        <strong>“Transaction”</strong> means a change to the data set through a new entry in the continuous Blockchain.
      </li>
      <li>
        <strong>“Smart Contract”</strong> means a piece of source code deployed as an application on the Blockchain
        which can be executed, including self-execution of Transactions as well as execution triggered by 3rd parties.
      </li>
      <li>
        <strong>“Token”</strong> means a digital asset transferred in a Transaction.
      </li>
      <li>
        <strong>“Wallet”</strong> means a cryptographic storage solution permitting you to store cryptographic assets by
        correlation of a (i) Public Key and (ii) a Private Key, or a Smart Contract to receive, manage and send Tokens.
      </li>
      <li>
        <strong>“Recovery Phrase”</strong> means a series of secret words used to generate one or more Private Keys and
        derived Public Keys.
      </li>
      <li>
        <strong>“Public Key”</strong> means a unique sequence of numbers and letters within the Blockchain to
        distinguish the network participants from each other.
      </li>
      <li>
        <strong>“Private Key”</strong> means a unique sequence of numbers and/or letters required to initiate a
        Blockchain Transaction and should only be known by the legal owner of the Wallet.
      </li>
    </ul>

    <h2>3. What are the Services offered?</h2>
    <p>
      Our services (“Services”) primarily consist of enabling users to create their Safe Accounts and ongoing
      interaction with it on the Blockchain.
    </p>
    <h3>“Safe Account”</h3>
    <p>
      A Safe Account is a modular, self-custodial (i.e. not supervised by us) smart contract-based wallet not provided
      by CC. Safe Accounts are open-source released under LGPL-3.0.
    </p>
    <p>
      Smart contract wallet means, unlike a standard private key Wallet, that access control for authorizing any
      Transaction is defined in code. An example are multi-signature wallets which require that any Transaction must be
      signed by a minimum number of signing wallets whereby the specifics of the requirements to authorize a Transaction
      can be configured in code.
    </p>
    <p>
      Owners need to connect a signing wallet with a Safe Account. Safe Accounts are compatible inter alia with standard
      private key Wallets such as hardware wallets, browser extension wallets and mobile wallets that support
      WalletConnect.
    </p>

    <h3>“Safe App”</h3>
    <p>
      You may access Safe Accounts using the {'Safe{Wallet}'} web app, mobile app for iOS and android, or the browser
      extension (each a “Safe App”). The Safe App may be used to manage your personal digital assets on Ethereum and
      other common EVM chains when you connect a Safe Account with third-party services (as defined below). The Safe App
      provides certain features that may be amended from time to time.
    </p>

    <h3>“Third-Party Safe Apps”</h3>
    <p>
      The Safe App allows you to connect Safe Accounts to third-party decentralized applications (“Third-Party Safe
      Apps”) and use third-party services such as from the decentralized finance sector, DAO Tools or services related
      to NFTs (“Third-Party Services”). The Third-Party Safe Apps are integrated in the user interface of the Safe App
      via inline framing. The provider of the Third-Party Safe App and related Third-Party Service is responsible for
      the operation of the service and the correctness, completeness and actuality of any information provided therein.
      We make a pre-selection of Third-Party Safe Apps that we show in the Safe App. However, we only perform a rough
      triage in advance for obvious problems and functionality in terms of loading time and resolution capability of the
      transactions. Accordingly, in the event of any (technical) issues concerning the Third-Party Services, the user
      must only contact the respective service provider directly. The terms of service, if any, shall be governed by the
      applicable contractual provisions between the User and the respective provider of the Third-Party Service.
      Accordingly, we are not liable in the event of a breach of contract, damage or loss related to the use of such
      Third-Party Service.
    </p>

    <h2>4. What do the Services not consist of?</h2>
    <p>Our Services do not consist of:</p>
    <ul>
      <li>
        activity regulated by the Federal Financial Supervisory Authority (BaFin) or any other regulatory agency in any
        jurisdiction;
      </li>
      <li>coverage underwritten by any regulatory agency’s compensation scheme;</li>
      <li>
        custody of your Recovery Phrase, Private Keys, Tokens or the ability to remove or freeze your Tokens, i.e. a
        Safe Account is a self-custodial wallet;
      </li>
      <li>the storage or transmission of fiat currencies;</li>
      <li>
        back-up services to recover your Recovery Phrase or Private Keys, for whose safekeeping you are solely
        responsible; CC has no means to recover your access to your Tokens, when you lose access to your Safe Account;
      </li>
      <li>
        any form of legal, financial, investment, accounting, tax or other professional advice regarding Transactions
        and their suitability to you;
      </li>
      <li>
        the responsibility to monitor authorized Transactions or to check the correctness or completeness of
        Transactions before you are authorizing them;
      </li>
      <li>notifications about events occurring in or connection with your Safe Account;</li>
      <li>recovery of your Safe Account;</li>
      <li>flagging malicious transactions;</li>
      <li>issuance of the Safe Token and any related functionalities or reward programs.</li>
    </ul>

    <h2>5. What do you need to know about Third-Party Services?</h2>
    <p>
      We provide you the possibility to interact with your Safe Account through Third-Party Services. Any activities you
      engage in with, or services you receive from a third party is between you and that third party directly. The
      conditions of service provisions, if any, shall be governed by the applicable contractual provisions between you
      and the respective provider of the Third-Party Service.
    </p>
    <p>
      The Services rely in part on third-party and open-source software, including the Blockchain, and the continued
      development and support by third parties. There is no assurance or guarantee that those third parties will
      maintain their support of their software or that open-source software will continue to be maintained. This may
      have a material adverse effect on the Services.
    </p>
    <p>This means specifically:</p>
    <ul>
      <li>
        We do not have any oversight over your activities with Third-Party Services especially by using Third-Party Safe
        Apps, and therefore we do not and cannot make any representation regarding their appropriateness and suitability
        for you.
      </li>
      <li>
        Third-Party Services are not hosted, owned, controlled or maintained by us. We also do not participate in the
        Transaction and will not and cannot monitor, verify, censor or edit the functioning or content of any
        Third-Party Service.
      </li>
      <li>
        We have not conducted any security audit, bug bounty or formal verification (whether internal or external) of
        the Third-Party Services.
      </li>
      <li>
        We have no control over, do not recommend, endorse, or otherwise take a position on the integrity, functioning
        of, content and your use of Third-Party Services, whose sole responsibility lies with the person from whom such
        services or content originated.
      </li>
      <li>
        When you access or use Third-Party Services you accept that there are risks in doing so and that you alone
        assume any such risks when choosing to interact with them. We are not liable for any errors or omissions or for
        any damages or loss you might suffer through interacting with those Third-Party Services, such as Third-Party
        Safe Apps.
      </li>
      <li>
        You know of the inherent risks of cryptographic and Blockchain-based systems and the high volatility of Token
        markets. Transactions undertaken in the Blockchain are irrevocable and irreversible and there is no possibility
        to refund Token that have been deployed.
      </li>
      <li>
        You should read the license requirements, terms and conditions as well as privacy policy of each Third-Party
        Service that you access or use. Certain Third-Party Services may involve complex Transactions that entail a high
        degree of risk.
      </li>
      <li>
        If you contribute integrations to Third-Party Services, you are responsible for all content you contribute, in
        any manner, and you must have all rights necessary to do so, in the manner in which you contribute it. You are
        responsible for all your activity in connection with any such Third-Party Service.
      </li>
      <li>
        Your interactions with persons found on or through the Third-Party Service, including payment and delivery of
        goods and services, financial transactions, and any other terms associated with such dealings, are solely
        between you and such persons. You agree that we shall not be responsible or liable for any loss or damage of any
        sort incurred as the result of any such dealings.
      </li>
      <li>
        If there is a dispute between you and the Third-Party Service provider or/and other users of the Third-Party
        Service, you agree that we are under no obligation to become involved. In the event that you have a dispute with
        one or more other users, you release us, our officers, employees, agents, contractors and successors from
        claims, demands, and damages of every kind or nature, known or unknown, suspected or unsuspected, disclosed or
        undisclosed, arising out of or in any way related to such disputes and/or our Services.
      </li>
    </ul>

    <h2>6. What are the fees for the Services?</h2>
    <p>
      The use of the Safe App or Third-Party Safe Apps may cause fees, including network fees, as indicated in the
      respective app. CC has no control over the fees charged by the Third-Party Services. CC may change its own fees at
      any time. Price changes will be communicated to the User in due time before taking effect.
    </p>
    <p>
      The User is only entitled to offset and/or assert rights of retention if his counterclaims are legally
      established, undisputed or recognized by CC.
    </p>

    <h2>7. Are we responsible for the security of your Private Keys, Recovery Phrase or other credentials?</h2>
    <p>
      We shall not be responsible to secure your Private Keys, Recovery Phrase, credentials or other means of
      authorization of your wallet(s).
    </p>
    <p>
      You must own and control any wallet you use in connection with our Services. You are responsible for implementing
      all appropriate measures for securing any wallet you use, including any Private Key(s), Recovery Phrase,
      credentials or other means of authorization necessary to access such storage mechanism(s).
    </p>
    <p>
      We exclude any and all liability for any security breaches or other acts or omissions, which result in your loss
      of access or custody of any cryptographic assets stored thereon.
    </p>

    <h2>8. Are we responsible for recovering your Safe Account?</h2>
    <p>We shall not be responsible for recovering your Safe Account.</p>
    <p>You are solely responsible for securing a back-up of your Safe Account access as you see fit.</p>
    <p>
      Any recovery feature we provide access to within the Safe App is a mechanism controlled by your Safe Account on
      the Blockchain, both of which we don&apos;t have any influence over once you have set it up. We will never act as
      a recoverer ourselves and don&apos;t offer recovery services. The Self Custodial Recovery feature allows you to
      determine your own recovery setup and nominate anyone including yourself as your recoverer. The recoverer can
      start the recovery process at any time. Please note that we are not responsible for notifying you of this process
      (see Section 7 above). Furthermore we reserve the right to cease the access to the Self Custodial Recovery feature
      via our Safe App taking the user&apos;s reasonable interests into account and providing due notification.
    </p>
    <p>The recovery feature is provided free of charge and liability is limited pursuant to Section 18 below.</p>

    <h2>9. Are we responsible for notifying you about events occurring in your Safe Account?</h2>
    <p>
      We shall not be responsible for notifying you of any interactions or events occurring in your Safe Account, be it
      on the Blockchain, third-party interfaces, within any other infrastructure, or our Services.
    </p>
    <p>You are responsible for monitoring Safe Account as you see fit.</p>
    <p>
      Any notification service we provide or offer for subscription within the Safe App via e-mail or push notifications
      or any other means of communication is provided free of charge and liability is limited pursuant to Section 18
      below. Furthermore we reserve the right to change the notification feature from time to time or cease to provide
      them without notice.
    </p>

    <h2>10. Are we responsible for flagging malicious transactions?</h2>
    <p>We shall not be responsible for flagging malicious transactions in our Safe App.</p>
    <p>
      You are solely responsible for checking any transaction, address, Token or other item you interact with via your
      Smart Account in our Safe App.
    </p>
    <p>
      Any security flagging or warning service we provide or offer for subscription within the Safe App is provided free
      of charge and liability is limited pursuant to Section 18 below. Furthermore we reserve the right to change the
      feature from time to time or cease to provide them without notice.
    </p>

    <h2>12. Are we responsible for third-party content and services?</h2>
    <p>
      You may view, have access to, and use third-party content and services, for example widget integrations, within
      the Safe App (“Third-Party Features”). You view, access, or use Third-Party Features at your own election. Your
      reliance on Third-Party Features is subject to separate terms and conditions set forth by the applicable third
      party content and/or service provider (“Third-Party Terms”). Third-Party Terms may, amongst other things, involve
      separate fees and charges, include disclaimers or risk warnings, apply a different terms and privacy policy.
    </p>
    <p>
      Third Party Features are provided for your convenience only. We do not verify, curate, or control Third Party
      Features.
    </p>
    <p>
      If we offer access to Third-Party Features in the Safe App free of charge by us (Third-Parties may charge separate
      fees), the liability for providing access to such Third-Party Feature is limited pursuant to Section 18 below.
      Furthermore we reserve the right to cease to provide access to those Third-Party Features through the Safe App
      without notice.
    </p>

    <h2>13. Can we terminate or limit your right to use our Services?</h2>
    <p>
      We may cease offering our Services and/or terminate the Agreement and refuse access to the Safe Apps at any time.
      The right of the parties to terminate the Agreement at any time for cause remains unaffected. In case of our
      termination of the Agreement, you may no longer access your Safe Account via our Services. However, you may
      continue to access your Safe Account and any Tokens via a third-party wallet provider using your Recovery Phrase
      and Private Keys.
    </p>
    <p>
      We reserve the right to limit the use of the Safe Apps to a specified number of Users if necessary to protect or
      ensure the stability and integrity of the Services. We will only be able to limit access to the Services. At no
      time will we be able to limit or block access to or transfer your funds without your consent.
    </p>

    <h2>14. Can you terminate your Agreement with us?</h2>
    <p>You may terminate the Agreement at any time without notice.</p>

    <h2>15. What licenses and access do we grant to you?</h2>
    <p>
      All intellectual property rights in Safe Accounts and the Services throughout the world belong to Safe Global(Core
      Contributors GmbH) as owner or their licensors. Nothing in these Terms gives you any rights in respect of any
      intellectual property owned by us or our licensors and you acknowledge that you do not acquire any ownership
      rights by downloading the Safe App or any content from the Safe App.
    </p>
    <p>
      If you are a consumer we grant you a simple, limited license, but do not sell to you the Services you download
      solely for your own personal, non-commercial use.
    </p>

    <h2>16. What can you expect from the Services and can we make changes to them?</h2>
    <p>
      Without limiting your mandatory warranties, we provide the Services to you “as is” and “as available” in relation
      to merchantability, fitness for a particular purpose, availability, security, title or non-infringement.
    </p>
    <p>
      If you use the Safe App via web browser, the strict liability of CC for damages for defects existing at the time
      of conclusion of the contract is precluded.
    </p>
    <p>
      We reserve the right to change the format and features of the Services by making any updates to Services available
      for you to download or, where your device settings permit it, by automatic delivery of updates.
    </p>
    <p>
      You are not obliged to download the updated Services, but we may cease to provide and/or update prior versions of
      the Services and, depending on the nature of the update, in some circumstances you may not be able to continue
      using the Services until you have downloaded the updated version.
    </p>
    <p>
      We may cease to provide and/or update content to the Services, with or without notice to you, if it improves the
      Services we provide to you, or we need to do so for security, legal or any other reasons.
    </p>

    <h2>17. What do you agree, warrant and represent?</h2>
    <p>By using our Services you hereby agree, represent and warrant that:</p>
    <ul>
      <li>
        You are not a citizen, resident, or member of any jurisdiction or group that is subject to economic sanctions by
        the European Union or the United States or any other relevant jurisdiction.
      </li>
      <li>
        You do not appear on HMT Sanctions List, the U.S. Treasury Department&apos;s Office of Foreign Asset
        Control&apos;s sanctions lists, the U.S. commerce department&apos;s consolidated screening list, the EU
        consolidated list of persons, groups or entities subject to EU Financial Sanctions, nor do you act on behalf of
        a person sanctioned thereunder.
      </li>
      <li>You have read and understood these Terms and agree to be bound by its terms.</li>
      <li>
        Your usage of our Services is legal under the laws of your jurisdiction or under the laws of any other
        jurisdiction to which you may be subject.
      </li>
      <li>
        You won’t use the Services or interact with the Services in a manner that violates any law or regulation,
        including, without limitation, any applicable export control laws.
      </li>
      <li>
        You understand the functionality, usage, storage, transmission mechanisms and intricacies associated with Tokens
        as well as wallet (including Safe Account) and Blockchains.
      </li>
      <li>
        You understand that Transactions on the Blockchain are irreversible and may not be erased and that your Safe
        Account address and Transactions are displayed permanently and publicly.
      </li>
      <li>
        You will comply with any applicable tax obligations in your jurisdiction arising from your use of the Services.
      </li>
      <li>
        You will not misuse or gain unauthorized access to our Services by knowingly introducing viruses, cross-site
        scripting, Trojan horses, worms, time-bombs, keystroke loggers, spyware, adware or any other harmful programs or
        similar computer code designed to adversely affect our Services and that in the event you do so or otherwise
        attack our Services, we reserve the right to report any such activity to the relevant law enforcement
        authorities and we will cooperate with those authorities as required.
      </li>
      <li>
        You won’t access without authority, interfere with, damage or disrupt any part of our Services, any equipment or
        network on which our Services is stored, any software used in the provision of our Services or any equipment or
        network or software owned or used by any third party.
      </li>
      <li>
        You won’t use our Services for activities that are unlawful or fraudulent or have such purpose or effect or
        otherwise support any activities that breach applicable local, national or international law or regulations.
      </li>
      <li>
        You won’t use our Services to store, trade or transmit Tokens that are proceeds of criminal or fraudulent
        activity.
      </li>
      <li>
        You understand that the Services and the underlying Blockchain are in an early development stage and we
        accordingly do not guarantee an error-free process and give no price or liquidity guarantee.
      </li>
      <li>You are using the Services at your own risk.</li>
    </ul>

    <h2>18. What about our liability to you?</h2>
    <p>
      If the Safe App or Services are provided to the User free of charge (please note, in this context, that any
      service, network, and/or transaction fees may be charged by third parties via the Blockchain and not necessarily
      by us), CC shall be liable only in cases of intent, gross negligence, or if CC has fraudulently concealed a
      possible material or legal defect of the Safe App or Services.
    </p>
    <p>
      If the Safe App or Services are not provided to the User free of charge, CC shall be liable only (i) in cases
      pursuant to Clause 18.1 as well as (ii) in cases of simple negligence for damages resulting from the breach of an
      essential contractual duty, a duty, the performance of which enables the proper execution of this Agreement in the
      first place and on the compliance of which the User regularly relies and may rely, whereby CC&apos;s liability
      shall be limited to the compensation of the foreseeable, typically occurring damage. The Parties agree that the
      typical foreseeable damage equals 100$ (one hundred USD). Liability in cases of simple negligence for damages
      resulting from the breach of a non-essential contractual duty are excluded.
    </p>
    <p>
      The limitation of liability also applies to the personal liability of the organs, legal representatives, employees
      and vicarious agents of CC.
    </p>
    <p>
      If the User suffers damages due to the loss of data, CC is not liable for this, insofar as the damage would have
      been avoided by a regular and complete backup of all relevant data by the User.
    </p>
    <p>
      In the event of disruptions to the technical infrastructure, the internet connection or a relevant Blockchain that
      we are not responsible for, we shall be exempt from our obligation to perform. This also applies if we are
      prevented from performing due to force majeure or other circumstances, the elimination of which is not possible or
      cannot be economically expected of CC.
    </p>

    <h2>19. What about viruses, bugs and security vulnerabilities?</h2>
    <p>We endeavor to provide our Service free from material bugs, security vulnerabilities or viruses.</p>
    <p>
      You are responsible for configuring your information technology and computer programmes to access our Services and
      to use your own virus protection software.
    </p>
    <p>
      If you become aware of any exploits, bugs or vulnerabilities, please inform{' '}
      <a href="mailto:safe-support@protofire.io">safe-support@protofire.io</a>.
    </p>
    <p>
      You must not misuse our Services by knowingly introducing material that is malicious or technologically harmful.
      If you do, your right to use our Services will cease immediately.
    </p>

    <h2>20. What if an event outside our control happens that affects our Services?</h2>
    <p>
      We may update and change our Services from time to time. We may suspend or withdraw or restrict the availability
      of all or any part of our Services for business, operational or regulatory reasons or because of a Force Majeure
      Event at no notice.
    </p>
    <p>
      A “Force Majeure Event” shall mean any event, circumstance or cause beyond our reasonable control, which prevents,
      hinders or delays the provision of our Services or makes their provision impossible or onerous, including, without
      limitation:
    </p>
    <ul>
      <li>acts of God, flood, storm, drought, earthquake or other natural disaster;</li>
      <li>epidemic or pandemic (for the avoidance of doubt, including the 2020 Coronavirus Pandemic);</li>
      <li>
        terrorist attack, hacking or cyber threats, civil war, civil commotion or riots, war, threat of or preparation
        for war, armed conflict, imposition of sanctions, embargo, or breaking off of diplomatic relations;
      </li>
      <li>
        equipment or software malfunction or bugs including network splits or forks or unexpected changes in the
        Blockchain, as well as hacks, phishing attacks, distributed denials of service or any other security attacks;
      </li>
      <li>nuclear, chemical or biological contamination;</li>
      <li>
        any law statutes, ordinances, rules, regulations, judgments, injunctions, orders and decrees or any action taken
        by a government or public authority, including without limitation imposing a prohibition, or failing to grant a
        necessary license or consent;
      </li>
      <li>collapse of buildings, breakdown of plant or machinery, fire, explosion or accident; and</li>
      <li>strike, industrial action or lockout.</li>
    </ul>
    <p>
      We shall not be liable or responsible to you, or be deemed to have defaulted under or breached this Agreement, for
      any failure or delay in the provision of the Services or the performance of this Agreement, if and to the extent
      such failure or delay is caused by or results from or is connected to acts beyond our reasonable control,
      including the occurrence of a Force Majeure Event.
    </p>

    <h2>21. Who is responsible for your tax liabilities?</h2>
    <p>
      You are solely responsible to determine if your use of the Services have tax implications, in particular income
      tax and capital gains tax relating to the purchase or sale of Tokens, for you. By using the Services you agree not
      to hold us liable for any tax liability associated with or arising from the operation of the Services or any other
      action or transaction related thereto.
    </p>

    <h2>22. What if a court disagrees with part of this Agreement?</h2>
    <p>
      Should individual provisions of these Terms be or become invalid or unenforceable in whole or in part, this shall
      not affect the validity of the remaining provisions. The invalid or unenforceable provision shall be replaced by
      the statutory provision. If there is no statutory provision or if the statutory provision would lead to an
      unacceptable result, the parties shall enter negotiations to replace the invalid or unenforceable provision with a
      valid provision that comes as close as possible to the economic purpose of the invalid or unenforceable provision.
    </p>

    <h2>23. What if we do not enforce certain rights under this Agreement?</h2>
    <p>
      Our failure to exercise or enforce any right or remedy provided under this Agreement or by law shall not
      constitute a waiver of that or any other right or remedy, nor shall it prevent or restrict any further exercise of
      that or any other right or remedy.
    </p>

    <h2>24. Do third parties have rights?</h2>
    <p>
      Unless it expressly states otherwise, this Agreement does not give rise to any third-party rights, which may be
      enforced against us.
    </p>

    <h2>25. Can this Agreement be assigned?</h2>
    <p>
      We are entitled to transfer our rights and obligations under the Agreement in whole or in part to third parties
      with a notice period of four weeks. In this case, you have the right to terminate the Agreement without notice.
    </p>
    <p>
      You shall not be entitled to assign this Agreement to any third party without our express prior written consent.
    </p>

    <h2>26. Which Clauses of this Agreement survive termination?</h2>
    <p>
      All covenants, agreements, representations and warranties made in this Agreement shall survive your acceptance of
      this Agreement and its termination.
    </p>

    <h2>27. Data Protection</h2>
    <p>
      We inform you about our processing of personal data, including the disclosure to third parties and your rights as
      an affected party, in the Privacy Policy.
    </p>

    <h2>28. Which laws apply to the Agreement?</h2>
    <p>
      The Agreement including these Terms shall in all respects be governed by, and construed and interpreted in
      accordance with, the law of England and Wales without giving effect to any choice or conflict of law provision or
      rule.
    </p>

    <h2>29. How can you get support for Safe Accounts and tell us about any problems?</h2>
    <p>
      If you want to learn more about Safe Accounts or the Service or have any problems using them or have any
      complaints please get in touch via any of the following channels:
    </p>
    <p>
      Email: <a href="mailto:safe-support@protofire.io">safe-support@protofire.io</a>
    </p>
    <p>
      Report form: <a href="https://safe-support.protofire.io/">https://safe-support.protofire.io/</a>
    </p>

    <h2>30. Where is the place of legal proceedings?</h2>
    <p>
      Any dispute arising out of or in connection with this Agreement, including any question regarding its existence,
      validity or termination, shall be referred to and finally resolved by arbitration under the London Court of
      International Arbitration (LCIA) Rules, which Rules are deemed to be incorporated by reference to this Clause. The
      number of arbitrators shall be one. The seat, or legal place, of arbitration shall be London, England. The
      language to be used in the arbitral proceedings shall be English.
    </p>

    <h2>31. Is this all?</h2>
    <p>
      These Terms constitute the entire agreement between you and us in relation to the Agreement’s subject matter. It
      replaces and extinguishes any and all prior agreements, draft agreements, arrangements, warranties, statements,
      assurances, representations and undertakings of any nature made by, or on behalf of either of us, whether oral or
      written, public or private, in relation to that subject matter.
    </p>
  </div>
)

const Terms: NextPage = () => {
  return (
    <>
      <Head>
        <title>{'Zetachain Wallet – Terms'}</title>
      </Head>

      <main>{<SafeTerms />}</main>
    </>
  )
}

export default Terms

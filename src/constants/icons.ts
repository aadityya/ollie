import React from 'react';
import { SvgProps } from 'react-native-svg';

export type IconComponent = React.FC<SvgProps>;

// Activity icons
import FeedIcon from '../../assets/icons/feed-milk.svg';
import FeedSolidIcon from '../../assets/icons/feed-solid.svg';
import SleepIcon from '../../assets/icons/sleep.svg';
import PeeIcon from '../../assets/icons/pee.svg';
import PoopIcon from '../../assets/icons/poop.svg';
import ColicIcon from '../../assets/icons/colic.svg';
import TummyTimeIcon from '../../assets/icons/tummy-time.svg';
import SunTimeIcon from '../../assets/icons/sun-time.svg';

// Nav icons
import HomeIcon from '../../assets/icons/home.svg';
import LogIcon from '../../assets/icons/log.svg';
import InsightsIcon from '../../assets/icons/insights.svg';
import MoreIcon from '../../assets/icons/more-options.svg';

// Settings & More page icons
import SettingsIcon from '../../assets/icons/settings.svg';
import MilestonesIcon from '../../assets/icons/milestones.svg';
import MedicationsIcon from '../../assets/icons/medications.svg';
import MeasurementsIcon from '../../assets/icons/measurements.svg';
import MemoriesIcon from '../../assets/icons/memories.svg';
import AppointmentsIcon from '../../assets/icons/appointments.svg';
import DashboardIcon from '../../assets/icons/dashboard.svg';

// Baby profile icons
import BoyIcon from '../../assets/icons/boy.svg';
import GirlIcon from '../../assets/icons/girl.svg';
import GenderNeutralIcon from '../../assets/icons/gender-neutral.svg';

// Mood icons (for HappinessSlider)
import MoodDistressedIcon from '../../assets/icons/mood-distressed.svg';
import MoodFussyIcon from '../../assets/icons/mood-fussy.svg';
import MoodCalmIcon from '../../assets/icons/mood-calm.svg';
import MoodContentIcon from '../../assets/icons/mood-content.svg';
import MoodHappyIcon from '../../assets/icons/mood-happy.svg';

export const AppIcons: Record<string, IconComponent> = {
  // Activity icons
  feed: FeedIcon,
  feedSolid: FeedSolidIcon,
  sleep: SleepIcon,
  pee: PeeIcon,
  poop: PoopIcon,
  colic: ColicIcon,
  bellyTime: TummyTimeIcon,
  sunTime: SunTimeIcon,
  // Nav icons
  home: HomeIcon,
  log: LogIcon,
  insights: InsightsIcon,
  more: MoreIcon,
  // Settings & More
  settings: SettingsIcon,
  milestones: MilestonesIcon,
  medications: MedicationsIcon,
  measurements: MeasurementsIcon,
  memories: MemoriesIcon,
  appointments: AppointmentsIcon,
  dashboard: DashboardIcon,
  // Baby profiles
  boy: BoyIcon,
  girl: GirlIcon,
  genderNeutral: GenderNeutralIcon,
};

export const MoodIcons: IconComponent[] = [
  MoodFussyIcon,      // Hard (index 0)
  MoodCalmIcon,       // Okay (index 1)
  MoodHappyIcon,      // Great (index 2)
];

// Welcome screen
import WelcomeScreenLogoIcon from '../../assets/icons/welcome-screen-logo.svg';
import WelcomeLogoIcon from '../../assets/icons/welcome-logo.svg';
export const WelcomeScreenLogo = WelcomeScreenLogoIcon;
export const WelcomeLogo = WelcomeLogoIcon;

export const WelcomeBg = require('../../assets/images/welcome-bg.jpg');

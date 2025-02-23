import { create } from 'zustand';

export enum SkillType {
  WOODCUTTING = 'WOODCUTTING',
  MINING = 'MINING',
}

interface Skill {
  level: number;
  experience: number;
  maxLevel: number;
}

interface SkillsState {
  skills: Record<SkillType, Skill>;
  addExperience: (skillType: SkillType, amount: number) => void;
  getLevel: (skillType: SkillType) => number;
  getExperience: (skillType: SkillType) => number;
  getNextLevelExperience: (skillType: SkillType) => number;
  getLevelProgress: (skillType: SkillType) => number;
}

const MAX_LEVEL = 99;
const MAX_EXPERIENCE = 200_000_000; // 200M XP cap
const XP_TABLE: number[] = [];

// Generate experience table using the formula: floor(L - 1 + 300 * 2^((L-1)/7))
function calculateXPForLevel(level: number): number {
  let totalXP = 0;
  for (let i = 1; i < level; i++) {
    const difference = Math.floor(i - 1 + 300 * Math.pow(2, (i - 1) / 7));
    totalXP += difference;
  }
  return totalXP;
}

// Initialize XP table
for (let level = 1; level <= MAX_LEVEL; level++) {
  XP_TABLE[level] = calculateXPForLevel(level);
}

function getLevelForXP(xp: number): number {
  for (let level = MAX_LEVEL; level > 1; level--) {
    if (xp >= XP_TABLE[level]) {
      return level;
    }
  }
  return 1;
}

export const useSkillsStore = create<SkillsState>((set, get) => ({
  skills: {
    [SkillType.WOODCUTTING]: {
      level: 1,
      experience: 0,
      maxLevel: MAX_LEVEL,
    },
    [SkillType.MINING]: {
      level: 1,
      experience: 0,
      maxLevel: MAX_LEVEL,
    },
  },

  addExperience: (skillType: SkillType, amount: number) => {
    const skills = { ...get().skills };
    const skill = skills[skillType];
    
    // Add experience (capped at MAX_EXPERIENCE)
    skill.experience = Math.min(skill.experience + amount, MAX_EXPERIENCE);
    
    // Update level based on experience
    skill.level = getLevelForXP(skill.experience);

    set({ skills });
  },

  getLevel: (skillType: SkillType) => {
    return get().skills[skillType].level;
  },

  getExperience: (skillType: SkillType) => {
    return get().skills[skillType].experience;
  },

  getNextLevelExperience: (skillType: SkillType) => {
    const skill = get().skills[skillType];
    if (skill.level >= MAX_LEVEL) return MAX_EXPERIENCE;
    return XP_TABLE[skill.level + 1];
  },

  getLevelProgress: (skillType: SkillType) => {
    const skill = get().skills[skillType];
    if (skill.level >= MAX_LEVEL) return 100;

    const currentLevelXP = XP_TABLE[skill.level];
    const nextLevelXP = XP_TABLE[skill.level + 1];
    const xpIntoLevel = skill.experience - currentLevelXP;
    const xpBetweenLevels = nextLevelXP - currentLevelXP;

    return (xpIntoLevel / xpBetweenLevels) * 100;
  },
})); 
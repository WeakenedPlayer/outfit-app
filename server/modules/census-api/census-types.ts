// from http://census.daybreakgames.com/

export interface Message {
    'service': string;
    'type': string;
    'payload'?: any;
    'subscribe'?: SubscriptionResponse;
    'online'?: any;
}

export module CharacterCentricEvent{
    interface AchievementEarned {
        event_name: string,
        character_id: string,
        timestamp: string,
        world_id: string,
        achievement_id: string,
        zone_id: string
    }
    
    interface BattleRankUp {
        battle_rank: string,
        character_id: string,
        event_name: string,
        timestamp: string,
        world_id: string,
        zone_id: string
    }
    
    interface Death {
        attacker_character_id: string,
        attacker_fire_mode_id: string,
        attacker_loadout_id: string,
        attacker_vehicle_id: string,
        attacker_weapon_id: string,
        character_id: string,
        character_loadout_id: string,
        event_name: string,
        is_critical: string,
        is_headshot: string,
        timestamp: string,
        vehicle_id: string,
        world_id: string,
        zone_id: string
    }
    
    interface FacilityControl {
        duration_held: string,
        event_name: string,
        facility_id: string,
        new_faction_id: string,
        old_faction_id: string,
        outfit_id: string,
        timestamp: string,
        world_id: string,
        zone_id: string
    } 
    
    interface GainExperience {
        amount: string,
        character_id: string,
        event_name: string,
        experience_id: string,
        loadout_id: string,
        other_id: string,
        timestamp: string,
        world_id: string,
        zone_id: string
    }
    
    interface ItemAdded {
        character_id: string,
        context: string,
        event_name: string,
        item_count: string,
        item_id: string,
        timestamp: string,
        world_id: string,
        zone_id: string
    }
    
    interface MetagameEvent {
        event_name: string,
        experience_bonus: string,
        faction_nc: string,
        faction_tr: string,
        faction_vs: string,
        metagame_event_id: string,
        metagame_event_state: string,
        timestamp: string,
        world_id: string,
        zone_id: string
    }
    
    interface PlayerFacilityCapture {
        character_id: string,
        event_name: string,
        facility_id: string,
        outfit_id: string,
        timestamp: string,
        world_id: string,
        zone_id: string
    }
    
    interface PlayerFacilityDefend {
        character_id: string,
        event_name: string,
        facility_id: string,
        outfit_id: string,
        timestamp: string,
        world_id: string,
        zone_id: string
    }
    
    interface SkillAdded {
        character_id: string,
        event_name: string,
        skill_id: string,
        timestamp: string,
        world_id: string,
        zone_id: string
    }
        
    interface VehicleDestroy {
        attacker_character_id: string,
        attacker_loadout_id: string,
        attacker_vehicle_id: string,
        attacker_weapon_id: string,
        character_id: string,
        event_name: string,
        facility_id: string,
        faction_id: string,
        timestamp: string,
        vehicle_id: string,
        world_id: string,
        zone_id: string
    }
}

export module WorldCentricEvent {
    interface ContinentLock {
        event_name: string,
        timestamp: string,
        world_id: string,
        zone_id: string,
        triggering_faction: string,
        previous_faction: string,
        vs_population: string,
        nc_population: string,
        tr_population: string,
        metagame_event_id: string,
        event_type: string
    }
    
    interface ContinentUnlock {
        event_name: string,
        timestamp: string,
        world_id: string,
        zone_id: string,
        triggering_faction: string,
        previous_faction: string,
        vs_population: string,
        nc_population: string,
        tr_population: string,
        metagame_event_id: string,
        event_type: string
    }
    
    interface FacilityControl {
        event_name: string,
        timestamp: string,
        world_id: string,
        old_faction_id: string,
        outfit_id: string,
        new_faction_id: string,
        facility_id: string,
        duration_held: string,
        zone_id: string
    }
    
    interface MetagameEvent {
        event_name: string,
        timestamp: string,
        world_id: string,
        experience_bonus: string,
        faction_nc: string,
        faction_tr: string,
        faction_vs: string,
        metagame_event_id: string,
        metagame_event_state: string,
        zone_id: string
    }
}


export module CharcterAndWorldCentricEvent {
    interface PlayerLogin {
        character_id: string,
        event_name: string,
        timestamp: string,
        world_id: string
    }
    
    interface PlayerLogout {
        character_id: string,
        event_name: string,
        timestamp: string,
        world_id: string
    }
}

export interface RecentPlayerIdsResponse {
    recent_character_id_count: string;
    recent_character_id_list: string[]; 
}

export interface RecentPlayerIdsCountResponse {
    recent_character_id_count: string;
}

// subscription:
export interface SubscriptionResponse {
    characterCount: string,
    eventNames: string[],
    logicalAndCharactersWithWorlds: string,
    worlds: string[]
}
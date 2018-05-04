import { Census } from '@weakenedplayer/census-api';

export interface CharacterName extends Census.RestType.CharacterName {}

export interface CharacterIdJoinCharacterWorld extends Census.RestType.CharactersWorld {
    'world_id_join_world': Census.RestType.World;
}

export interface CharacterProfile extends Census.RestType.Character {
    'character_id_join_characters_world': CharacterIdJoinCharacterWorld;
    'faction_id_join_faction': Census.RestType.Faction;
    'character_id_join_outfit_member_extended'?: Census.RestType.OutfitMemberExtended;
}
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Users, Shield, Car, Wrench, Megaphone, DollarSign, Flag, Loader2 } from "lucide-react";
import { supabaseAdmin } from "../../lib/supabase";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const TEAM_ROLES = [
  {
    id: 'docent',
    name: 'Docent',
    description: 'Verantwoordelijk voor het team, ondersteunt teamleider, neemt veiligheidstest af',
    icon: Shield,
    color: 'bg-blue-500'
  },
  {
    id: 'teamleider',
    name: 'Teamleider',
    description: 'Geeft leiding aan team, kent spelregels, regelt inschrijvingen, aanspreekpunt organisatie',
    icon: Users,
    color: 'bg-green-500'
  },
  {
    id: 'coureur',
    name: 'Coureur',
    description: 'Bestuurt voertuig, kent vlagregels, veiligheid op baan staat hoog in vaandel',
    icon: Car,
    color: 'bg-red-500'
  },
  {
    id: 'monteur',
    name: 'Monteur',
    description: 'Zorgt voor bouw en onderhoud van voertuig, gereedschap en onderdelen',
    icon: Wrench,
    color: 'bg-orange-500'
  },
  {
    id: 'pr_manager',
    name: 'Public Relations Manager',
    description: 'Communicatie-uitingen, woordvoerder, sponsors, teamkleding, catering',
    icon: Megaphone,
    color: 'bg-purple-500'
  },
  {
    id: 'financieel_manager',
    name: 'Financieel Manager',
    description: 'Businessplan, financiële verplichtingen, overzicht inkomsten en uitgaven',
    icon: DollarSign,
    color: 'bg-yellow-500'
  },
  {
    id: 'baanmarshall',
    name: 'Baanmarshall',
    description: 'Vlaggen tijdens rijdagen, kan niet tevens teamleider, coureur of monteur zijn',
    icon: Flag,
    color: 'bg-indigo-500'
  }
];

const MOCK_TEAM_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Jan de Vries', email: 'jan@racingteam.nl', role: 'docent', status: 'active' },
  { id: '2', name: 'Pieter Jansen', email: 'pieter@racingteam.nl', role: 'teamleider', status: 'active' },
  { id: '3', name: 'Klaas Bakker', email: 'klaas@racingteam.nl', role: 'coureur', status: 'active' },
  { id: '4', name: 'Erik Visser', email: 'erik@racingteam.nl', role: 'monteur', status: 'active' },
  { id: '5', name: 'Martijn Smit', email: 'martijn@racingteam.nl', role: 'pr_manager', status: 'inactive' },
  { id: '6', name: 'Thomas Mulder', email: 'thomas@racingteam.nl', role: 'financieel_manager', status: 'active' },
  { id: '7', name: 'Wim de Boer', email: 'wim@racingteam.nl', role: 'baanmarshall', status: 'active' },
];

export function AdminPanelPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch data from Supabase on component mount
  useEffect(() => {
    fetchTeamMembers();
    fetchRoles();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('team_members')
        .select(`
          id,
          is_active,
          users!inner(id, email, first_name, last_name),
          roles!inner(id, role_key, name)
        `);

      if (error) {
        console.error('Error fetching team members:', error);
        // Fall back to mock data if Supabase fails
        return;
      }

      const formattedMembers: TeamMember[] = data.map((member: any) => ({
        id: member.id,
        name: `${member.users?.first_name || ''} ${member.users?.last_name || ''}`.trim() || member.users?.email || 'Unknown',
        email: member.users?.email || 'unknown@example.com',
        role: member.roles?.role_key || 'unknown',
        status: member.is_active ? 'active' : 'inactive'
      }));

      setTeamMembers(formattedMembers);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('roles')
        .select('*');

      if (error) {
        console.error('Error fetching roles:', error);
        return;
      }

      console.log('Roles from Supabase:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      // Get role ID from role_key
      const { data: roleData, error: roleError } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('role_key', newRole)
        .single();

      if (roleError) {
        console.error('Error fetching role:', roleError);
        alert('Fout bij het ophalen van rol: ' + roleError.message);
        return;
      }

      // Update team member role in Supabase
      const { error: updateError } = await supabaseAdmin
        .from('team_members')
        .update({ role_id: roleData.id })
        .eq('id', memberId);

      if (updateError) {
        console.error('Error updating role:', updateError);
        alert('Fout bij het bijwerken van rol: ' + updateError.message);
        return;
      }

      // Update local state
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === memberId ? { ...member, role: newRole } : member
        )
      );
      
    } catch (error) {
      console.error('Error changing role:', error);
      alert('Er is een fout opgetreden bij het wijzigen van de rol');
    }
  };

  const handleStatusToggle = async (memberId: string) => {
    try {
      // Find the current member to get the new status
      const currentMember = teamMembers.find(m => m.id === memberId);
      if (!currentMember) return;

      const newStatus = currentMember.status === 'active' ? 'inactive' : 'active';
      
      // Update team member status in Supabase
      const { error: updateError } = await supabaseAdmin
        .from('team_members')
        .update({ is_active: newStatus === 'active' })
        .eq('id', memberId);

      if (updateError) {
        console.error('Error updating status:', updateError);
        alert('Fout bij het bijwerken van status: ' + updateError.message);
        return;
      }

      // Update local state
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === memberId 
            ? { ...member, status: newStatus }
            : member
        )
      );
      
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Er is een fout opgetreden bij het wijzigen van de status');
    }
  };

  const handleAddMember = async () => {
    if (!newMemberName || !newMemberEmail || !newMemberRole) {
      alert('Vul alle velden in');
      return;
    }

    try {
      setLoading(true);
      
      // Split name into first and last name
      const nameParts = newMemberName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Generate a simple username from email
      const username = newMemberEmail.split('@')[0];
      
      // 1. Create new user
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          email: newMemberEmail,
          username: username,
          first_name: firstName,
          last_name: lastName,
          password_hash: 'temp_password_hash' // You might want to generate a proper password or send an email
        })
        .select()
        .single();

      if (userError) {
        console.error('Error creating user:', userError);
        alert('Fout bij het aanmaken van gebruiker: ' + userError.message);
        return;
      }

      // 2. Get role ID from role_key
      const { data: roleData, error: roleError } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('role_key', newMemberRole)
        .single();

      if (roleError) {
        console.error('Error fetching role:', roleError);
        alert('Fout bij het ophalen van rol: ' + roleError.message);
        return;
      }

      // 3. Create team member (using first team as default)
      const { data: teamData, error: teamError } = await supabaseAdmin
        .from('teams')
        .select('id')
        .limit(1)
        .single();

      if (teamError) {
        console.error('Error fetching team:', teamError);
        alert('Fout bij het ophalen van team: ' + teamError.message);
        return;
      }

      // 4. Create team member record
      const { data: memberData, error: memberError } = await supabaseAdmin
        .from('team_members')
        .insert({
          user_id: userData.id,
          team_id: teamData.id,
          role_id: roleData.id,
          is_active: true
        })
        .select()
        .single();

      if (memberError) {
        console.error('Error creating team member:', memberError);
        alert('Fout bij het aanmaken van teamlid: ' + memberError.message);
        return;
      }

      // 5. Refresh the team members list
      await fetchTeamMembers();
      
      // Clear form
      setNewMemberName('');
      setNewMemberEmail('');
      setNewMemberRole('');
      
      alert('Teamlid succesvol toegevoegd!');
      
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Er is een fout opgetreden bij het toevoegen van het teamlid');
    } finally {
      setLoading(false);
    }
  };

  const getRoleInfo = (roleId: string) => {
    return TEAM_ROLES.find(role => role.id === roleId);
  };

  const getRoleDistribution = () => {
    const distribution = TEAM_ROLES.map(role => ({
      ...role,
      count: teamMembers.filter(member => member.role === role.id && member.status === 'active').length
    }));
    return distribution;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-slate-300">Beheer teamrollen en leden</p>
      </div>

      {/* Role Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {getRoleDistribution().map((role) => {
          const Icon = role.icon;
          return (
            <Card key={role.id} className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${role.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant={role.count > 0 ? "default" : "secondary"} className="bg-slate-700 text-white">
                    {role.count}
                  </Badge>
                </div>
                <CardTitle className="text-white text-lg">{role.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm mb-2">{role.description}</p>
                <div className="text-xs text-slate-400">
                  {role.count === 0 ? 'Niet toegewezen' : role.count === 1 ? '1 lid toegewezen' : `${role.count} leden toegewezen`}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add New Member */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Nieuw Teamlid Toevoegen</CardTitle>
          <CardDescription className="text-slate-300">Voeg een nieuw teamlid toe en wijs een rol toe</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Naam</Label>
              <Input
                id="name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Volledige naam"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="email@voorbeeld.nl"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">Rol</Label>
              <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Selecteer rol" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {TEAM_ROLES.map(role => (
                    <SelectItem key={role.id} value={role.id} className="text-white">
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleAddMember}
                disabled={loading}
                className="w-full text-white"
                style={{ background: 'linear-gradient(45deg, #d35481 0%, #eab75b 100%)' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Bezig met toevoegen...
                  </>
                ) : (
                  <>
                    Toevoegen
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members List */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Teamleden</CardTitle>
          <CardDescription className="text-slate-300">Beheer teamleden en hun rollen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => {
              const roleInfo = getRoleInfo(member.role);
              const RoleIcon = roleInfo?.icon || Users;
              
              return (
                <div key={member.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${roleInfo?.color || 'bg-slate-600'}`}>
                      <RoleIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{member.name}</h3>
                      <p className="text-slate-400 text-sm">{member.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Select 
                      value={member.role} 
                      onValueChange={(newRole) => handleRoleChange(member.id, newRole)}
                    >
                      <SelectTrigger className="w-48 bg-slate-600 border-slate-500 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {TEAM_ROLES.map(role => (
                          <SelectItem key={role.id} value={role.id} className="text-white">
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Badge 
                      variant={member.status === 'active' ? 'default' : 'secondary'}
                      className={member.status === 'active' ? 'bg-green-600' : 'bg-slate-600'}
                    >
                      {member.status === 'active' ? 'Actief' : 'Inactief'}
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusToggle(member.id)}
                      className="border-slate-600 text-white hover:bg-slate-600"
                    >
                      {member.status === 'active' ? 'Deactiveer' : 'Activeer'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

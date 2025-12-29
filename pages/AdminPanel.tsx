
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, Trash2, ExternalLink, Search, Mail, Calendar, Settings, Music, ChevronRight, Activity } from 'lucide-react';
import Navbar from '../components/Navbar';
import { StorageService } from '../services/storageService';
import { User } from '../types';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [session] = useState(StorageService.getCurrentSession());

  useEffect(() => {
    if (!session?.isAdmin) {
      navigate('/');
      return;
    }
    setUsers(StorageService.getUsers());
  }, [session]);

  const handleDelete = (email: string) => {
    if (confirm(`CRITICAL: Are you sure you want to permanently delete account ${email}?`)) {
      StorageService.deleteUser(email);
      setUsers(StorageService.getUsers());
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) || 
    u.pressKit.displayName.toLowerCase().includes(search.toLowerCase()) ||
    u.pressKit.username.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    active: users.filter(u => u.pressKit.bio.length > 50).length,
    today: users.filter(u => new Date(u.createdAt).toDateString() === new Date().toDateString()).length
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-20 selection:bg-amber-500">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center space-x-3 text-amber-500 mb-4">
              <Shield className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">System Level Access</span>
            </div>
            <h1 className="text-6xl font-heading font-black text-white italic tracking-tighter uppercase">GOD MODE</h1>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
             <StatBox label="TOTAL USERS" value={stats.total} icon={<Users className="w-4 h-4" />} />
             <StatBox label="ACTIVE KITS" value={stats.active} icon={<Activity className="w-4 h-4" />} />
             <StatBox label="NEW TODAY" value={stats.today} icon={<Calendar className="w-4 h-4" />} />
          </div>
        </div>

        <div className="bg-zinc-900 rounded-[2.5rem] border border-zinc-800 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)]">
          <div className="p-8 border-b border-zinc-800 bg-zinc-900/50 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="relative flex-1 w-full max-w-xl">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input 
                  type="text" 
                  placeholder="Search by name, email or @username..."
                  className="w-full bg-black border border-zinc-800 rounded-2xl pl-14 pr-6 py-4 text-white focus:ring-2 focus:ring-amber-500/50 outline-none transition-all font-medium"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
             </div>
             <div className="flex items-center space-x-3">
               <button onClick={() => setUsers(StorageService.getUsers())} className="px-6 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl text-xs font-black tracking-widest uppercase transition-colors">
                  Sync Database
               </button>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] bg-black/40">
                  <th className="px-8 py-6">Identity</th>
                  <th className="px-8 py-6">Login Data</th>
                  <th className="px-8 py-6">Health</th>
                  <th className="px-8 py-6">Created</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/30">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-amber-500/[0.02] transition-colors group">
                    <td className="px-8 py-8">
                      <div className="flex items-center space-x-5">
                         <div className="w-14 h-14 rounded-2xl bg-black border border-zinc-800 overflow-hidden flex items-center justify-center">
                            {user.pressKit.photos[0] ? (
                              <img src={user.pressKit.photos[0].url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Avatar" />
                            ) : (
                              <Music className="w-6 h-6 text-zinc-800" />
                            )}
                         </div>
                         <div>
                            <p className="text-white font-black text-lg tracking-tight italic">{user.pressKit.displayName}</p>
                            <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">/u/{user.pressKit.username}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                       <div className="flex items-center space-x-3 text-zinc-400 font-medium">
                          <Mail className="w-4 h-4 text-zinc-600" />
                          <span className="text-sm">{user.email}</span>
                       </div>
                    </td>
                    <td className="px-8 py-8">
                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.pressKit.bio.length > 50 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {user.pressKit.bio.length > 50 ? 'Complete' : 'Empty Kit'}
                       </span>
                    </td>
                    <td className="px-8 py-8">
                       <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                          {new Date(user.createdAt).toLocaleDateString()}
                       </p>
                    </td>
                    <td className="px-8 py-8 text-right space-x-3">
                       <button 
                        onClick={() => navigate(`/u/${user.pressKit.username}`)}
                        className="p-3 bg-zinc-800 text-zinc-500 rounded-xl hover:text-white transition-all"
                        title="View Live Page"
                       >
                          <ExternalLink className="w-5 h-5" />
                       </button>
                       <button 
                        onClick={() => {
                          // The "God Mode" entry:
                          // We don't overwrite the session object email, we just navigate to dashboard
                          // and the dashboard will load the user's kit because we stored it in local storage
                          // In a real app, we'd pass an ?userId= query.
                          sessionStorage.setItem('pending_ai_kit', JSON.stringify(user.pressKit));
                          navigate(`/dashboard?source=ai`);
                        }}
                        className="p-3 bg-zinc-800 text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                        title="Modify Profile"
                       >
                          <Settings className="w-5 h-5" />
                       </button>
                       {!user.isAdmin && (
                        <button 
                          onClick={() => handleDelete(user.email)}
                          className="p-3 bg-zinc-800 text-zinc-700 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                          title="Delete Account"
                        >
                           <Trash2 className="w-5 h-5" />
                        </button>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="p-32 text-center">
               <Shield className="w-16 h-16 text-zinc-800 mx-auto mb-6 opacity-50" />
               <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-sm italic">User Registry Empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, icon }: { label: string, value: number, icon: React.ReactNode }) => (
  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl min-w-[160px] flex items-center justify-between shadow-xl">
    <div>
      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-white italic tracking-tighter">{value}</p>
    </div>
    <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
       {icon}
    </div>
  </div>
);

export default AdminPanel;

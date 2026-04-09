import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileEdit, Palette, Users, Globe, LogOut, Menu, X, Upload, Plus, Trash2, Save, ExternalLink, ChevronDown, ChevronUp, MapPin, Clock, Calendar, Image, Music, Video, Type } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const { admin, logout, authAxios, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('invites');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [invites, setInvites] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [rsvpList, setRsvpList] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [editingInvite, setEditingInvite] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return; }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadData = async () => {
    try {
      const [inv, des, rsvp, langs] = await Promise.all([
        authAxios.get('/admin/invites'),
        authAxios.get('/designs'),
        authAxios.get('/rsvp'),
        authAxios.get('/languages')
      ]);
      setInvites(inv.data);
      setDesigns(des.data);
      setRsvpList(rsvp.data);
      setLanguages(langs.data);
    } catch (err) {
      console.error('Load error:', err);
    }
  };

  const showMessage = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const saveInvite = async () => {
    if (!editingInvite) return;
    setSaving(true);
    try {
      const { slug, _id, design, created_at, ...updateData } = editingInvite;
      await authAxios.put(`/invite/${slug}`, updateData);
      showMessage('Invite saved successfully!');
      loadData();
    } catch (err) {
      showMessage('Error saving: ' + (err.response?.data?.detail || err.message));
    } finally { setSaving(false); }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await authAxios.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return `${BACKEND_URL}${res.data.url}`;
    } catch (err) {
      showMessage('Upload failed');
      return null;
    }
  };

  const handleFileUpload = async (e, field, index = null, subfield = null) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadFile(file);
    if (!url) return;
    const updated = { ...editingInvite };
    if (index !== null && subfield) {
      updated[field][index][subfield] = url;
    } else {
      updated[field] = url;
    }
    setEditingInvite(updated);
  };

  // Design management
  const [newDesign, setNewDesign] = useState({ name: '', description: '', thumbnail: '', heroBackground: '', openingVideo: '', openingPoster: '', cssVars: {} });

  const saveDesign = async () => {
    try {
      await authAxios.post('/admin/designs', newDesign);
      showMessage('Design created!');
      setNewDesign({ name: '', description: '', thumbnail: '', heroBackground: '', openingVideo: '', openingPoster: '', cssVars: {} });
      loadData();
    } catch (err) {
      showMessage('Error: ' + (err.response?.data?.detail || err.message));
    }
  };

  const deleteDesign = async (id) => {
    if (!window.confirm('Delete this design?')) return;
    try {
      await authAxios.delete(`/admin/designs/${id}`);
      showMessage('Design deleted');
      loadData();
    } catch (err) { showMessage('Error deleting'); }
  };

  const uploadDesignFile = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadFile(file);
    if (url) setNewDesign(p => ({ ...p, [field]: url }));
  };

  const tabs = [
    { id: 'invites', label: 'Invites', icon: FileEdit },
    { id: 'designs', label: 'Designs', icon: Palette },
    { id: 'rsvp', label: 'RSVP', icon: Users },
    { id: 'languages', label: 'Languages', icon: Globe },
  ];

  const updateField = (path, value) => {
    const updated = { ...editingInvite };
    const keys = path.split('.');
    let obj = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      if (keys[i].match(/^\d+$/)) {
        obj = obj[parseInt(keys[i])];
      } else {
        obj = obj[keys[i]];
      }
    }
    obj[keys[keys.length - 1]] = value;
    setEditingInvite({ ...updated });
  };

  const addStoryItem = () => {
    const updated = { ...editingInvite };
    updated.story = [...(updated.story || []), { id: Date.now().toString(), title: '', date: '', description: '', image: '' }];
    setEditingInvite(updated);
  };

  const removeStoryItem = (idx) => {
    const updated = { ...editingInvite };
    updated.story.splice(idx, 1);
    setEditingInvite({ ...updated });
  };

  const addEvent = () => {
    const updated = { ...editingInvite };
    updated.events = [...(updated.events || []), { id: Date.now().toString(), title: '', date: '', time: '', venue: '', address: '', mapLink: '', icon: 'heart' }];
    setEditingInvite(updated);
  };

  const removeEvent = (idx) => {
    const updated = { ...editingInvite };
    updated.events.splice(idx, 1);
    setEditingInvite({ ...updated });
  };

  const addGalleryItem = () => {
    const updated = { ...editingInvite };
    updated.gallery = [...(updated.gallery || []), { id: Date.now().toString(), url: '', alt: '' }];
    setEditingInvite(updated);
  };

  const removeGalleryItem = (idx) => {
    const updated = { ...editingInvite };
    updated.gallery.splice(idx, 1);
    setEditingInvite({ ...updated });
  };

  const inputStyle = "w-full px-3 py-2.5 rounded border text-sm bg-white/60 focus:bg-white transition-colors";
  const inputBorder = { borderColor: 'rgba(139,115,85,0.2)', fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' };
  const labelStyle = "block text-[10px] tracking-widest uppercase mb-1.5 font-medium";
  const labelColor = { fontFamily: '"Cinzel", serif', color: '#8B7355' };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f5f0e6' }}>
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200`} style={{ backgroundColor: '#2c2417' }}>
        <div className="p-6">
          <h2 className="text-lg mb-1" style={{ fontFamily: '"Cinzel Decorative", serif', color: '#f5f0e6' }}>WoooW</h2>
          <p className="text-xs opacity-50" style={{ color: '#c4a265' }}>{admin?.email}</p>
        </div>
        <nav className="px-4 space-y-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm transition-colors ${activeTab === tab.id ? 'bg-white/10' : 'hover:bg-white/5'}`} style={{ fontFamily: '"Cinzel", serif', color: activeTab === tab.id ? '#c4a265' : '#8B7355' }}>
              <tab.icon size={16} />{tab.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 rounded text-sm hover:bg-white/5 transition-colors" style={{ fontFamily: '"Cinzel", serif', color: '#8B7355' }}>
            <LogOut size={16} />Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="flex-1 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-20 px-4 py-3 flex items-center justify-between" style={{ backgroundColor: 'rgba(245,240,230,0.95)', borderBottom: '1px solid rgba(139,115,85,0.1)', backdropFilter: 'blur(10px)' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2">
            {sidebarOpen ? <X size={20} color="#2c2417" /> : <Menu size={20} color="#2c2417" />}
          </button>
          <h1 className="text-lg" style={{ fontFamily: '"Cinzel", serif', color: '#2c2417' }}>
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
          <div />
        </div>

        {/* Toast */}
        {message && <div className="fixed top-4 right-4 z-50 px-4 py-3 bg-[#2c2417] text-[#f5f0e6] rounded shadow-lg text-sm" style={{ fontFamily: '"Cinzel", serif' }}>{message}</div>}

        <div className="p-4 lg:p-6 max-w-5xl">
          {/* INVITES TAB */}
          {activeTab === 'invites' && (
            <div>
              {!editingInvite ? (
                <div className="space-y-3">
                  {invites.map(inv => (
                    <div key={inv.slug} className="flex items-center justify-between p-4 bg-white/60 rounded-lg" style={{ border: '1px solid rgba(139,115,85,0.1)' }}>
                      <div>
                        <p className="font-semibold text-sm" style={{ fontFamily: '"Cinzel", serif', color: '#2c2417' }}>{inv.couple?.groom} & {inv.couple?.bride}</p>
                        <p className="text-xs mt-1" style={{ color: '#8B7355' }}>/{inv.slug} • {inv.date?.split('T')[0]}</p>
                      </div>
                      <div className="flex gap-2">
                        <a href={`/invite/${inv.slug}`} target="_blank" rel="noreferrer" className="p-2 hover:bg-[#8B7355]/10 rounded transition-colors"><ExternalLink size={16} color="#8B7355" /></a>
                        <button onClick={() => setEditingInvite({...inv})} className="px-3 py-1.5 rounded text-xs tracking-wider uppercase" style={{ fontFamily: '"Cinzel", serif', backgroundColor: '#2c2417', color: '#f5f0e6' }}>Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Save bar */}
                  <div className="flex items-center justify-between sticky top-14 z-10 -mx-4 lg:-mx-6 px-4 lg:px-6 py-3" style={{ backgroundColor: 'rgba(245,240,230,0.95)', borderBottom: '1px solid rgba(139,115,85,0.1)' }}>
                    <button onClick={() => setEditingInvite(null)} className="text-sm underline" style={{ color: '#8B7355' }}>← Back</button>
                    <button onClick={saveInvite} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded text-xs tracking-wider uppercase" style={{ fontFamily: '"Cinzel", serif', backgroundColor: '#2c2417', color: '#f5f0e6', opacity: saving ? 0.7 : 1 }}>
                      <Save size={14} />{saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>

                  {/* Couple */}
                  <Section title="Couple Information">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Groom Name" value={editingInvite.couple?.groom} onChange={v => updateField('couple.groom', v)} />
                      <Field label="Bride Name" value={editingInvite.couple?.bride} onChange={v => updateField('couple.bride', v)} />
                      <Field label="Groom Full Name" value={editingInvite.couple?.groomFullName} onChange={v => updateField('couple.groomFullName', v)} />
                      <Field label="Bride Full Name" value={editingInvite.couple?.brideFullName} onChange={v => updateField('couple.brideFullName', v)} />
                      <Field label="Hashtag" value={editingInvite.couple?.hashtag} onChange={v => updateField('couple.hashtag', v)} />
                      <Field label="Wedding Date" type="datetime-local" value={editingInvite.date?.replace('Z','')} onChange={v => updateField('date', v)} />
                    </div>
                  </Section>

                  {/* Design & Media */}
                  <Section title="Design & Media">
                    <div className="space-y-3">
                      <div>
                        <label className={labelStyle} style={labelColor}>Design Template</label>
                        <select value={editingInvite.design_id || ''} onChange={e => updateField('design_id', e.target.value)} className={inputStyle} style={inputBorder}>
                          <option value="">Select design...</option>
                          {designs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                      </div>
                      <FileField label="Opening Video" accept="video/*" onUpload={e => handleFileUpload(e, 'openingVideo')} current={editingInvite.openingVideo} />
                      <FileField label="Opening Poster Image" accept="image/*" onUpload={e => handleFileUpload(e, 'openingPoster')} current={editingInvite.openingPoster} />
                      <FileField label="Hero Background" accept="image/*" onUpload={e => handleFileUpload(e, 'heroBackground')} current={editingInvite.heroBackground} />
                      <FileField label="Background Music" accept="audio/*" onUpload={e => handleFileUpload(e, 'music')} current={editingInvite.music} />
                      <Field label="Opening Poster URL (or paste)" value={editingInvite.openingPoster} onChange={v => updateField('openingPoster', v)} />
                      <Field label="Hero Background URL (or paste)" value={editingInvite.heroBackground} onChange={v => updateField('heroBackground', v)} />
                    </div>
                  </Section>

                  {/* Invitation Text */}
                  <Section title="Invitation Text">
                    <Field label="Tagline" value={editingInvite.tagline} onChange={v => updateField('tagline', v)} />
                    <Field label="Line 1" value={editingInvite.invitation?.line1} onChange={v => updateField('invitation.line1', v)} />
                    <Field label="Line 2" value={editingInvite.invitation?.line2} onChange={v => updateField('invitation.line2', v)} />
                  </Section>

                  {/* Story */}
                  <Section title="Love Story" action={<button onClick={addStoryItem} className="flex items-center gap-1 text-xs px-2 py-1 rounded" style={{ color: '#8B7355', border: '1px solid rgba(139,115,85,0.2)' }}><Plus size={12} />Add</button>}>
                    {editingInvite.story?.map((s, i) => (
                      <div key={s.id || i} className="p-4 bg-white/40 rounded mb-3" style={{ border: '1px solid rgba(139,115,85,0.1)' }}>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold" style={{ color: '#8B7355' }}>Story #{i + 1}</span>
                          <button onClick={() => removeStoryItem(i)} className="p-1 hover:bg-red-50 rounded"><Trash2 size={14} color="#dc2626" /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Title" value={s.title} onChange={v => updateField(`story.${i}.title`, v)} />
                          <Field label="Date" value={s.date} onChange={v => updateField(`story.${i}.date`, v)} />
                        </div>
                        <Field label="Description" value={s.description} onChange={v => updateField(`story.${i}.description`, v)} textarea />
                        <FileField label="Image" accept="image/*" onUpload={e => handleFileUpload(e, 'story', i, 'image')} current={s.image} />
                      </div>
                    ))}
                  </Section>

                  {/* Events */}
                  <Section title="Events" action={<button onClick={addEvent} className="flex items-center gap-1 text-xs px-2 py-1 rounded" style={{ color: '#8B7355', border: '1px solid rgba(139,115,85,0.2)' }}><Plus size={12} />Add</button>}>
                    {editingInvite.events?.map((ev, i) => (
                      <div key={ev.id || i} className="p-4 bg-white/40 rounded mb-3" style={{ border: '1px solid rgba(139,115,85,0.1)' }}>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold" style={{ color: '#8B7355' }}>Event #{i + 1}</span>
                          <button onClick={() => removeEvent(i)} className="p-1 hover:bg-red-50 rounded"><Trash2 size={14} color="#dc2626" /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Title" value={ev.title} onChange={v => updateField(`events.${i}.title`, v)} />
                          <Field label="Date" value={ev.date} onChange={v => updateField(`events.${i}.date`, v)} />
                          <Field label="Time" value={ev.time} onChange={v => updateField(`events.${i}.time`, v)} />
                          <Field label="Venue" value={ev.venue} onChange={v => updateField(`events.${i}.venue`, v)} />
                          <Field label="Address" value={ev.address} onChange={v => updateField(`events.${i}.address`, v)} />
                          <Field label="Map Link" value={ev.mapLink} onChange={v => updateField(`events.${i}.mapLink`, v)} />
                        </div>
                      </div>
                    ))}
                  </Section>

                  {/* Gallery */}
                  <Section title="Gallery" action={<button onClick={addGalleryItem} className="flex items-center gap-1 text-xs px-2 py-1 rounded" style={{ color: '#8B7355', border: '1px solid rgba(139,115,85,0.2)' }}><Plus size={12} />Add</button>}>
                    <div className="grid grid-cols-3 gap-3">
                      {editingInvite.gallery?.map((img, i) => (
                        <div key={img.id || i} className="relative group">
                          {img.url && <img src={img.url} alt={img.alt} className="w-full aspect-square object-cover rounded" />}
                          <div className="mt-2">
                            <FileField label="" accept="image/*" onUpload={e => handleFileUpload(e, 'gallery', i, 'url')} current={img.url} compact />
                          </div>
                          <button onClick={() => removeGalleryItem(i)} className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} color="white" /></button>
                        </div>
                      ))}
                    </div>
                  </Section>

                  {/* RSVP Config */}
                  <Section title="RSVP Settings">
                    <Field label="Title" value={editingInvite.rsvpQuestions?.title} onChange={v => updateField('rsvpQuestions.title', v)} />
                    <Field label="Subtitle" value={editingInvite.rsvpQuestions?.subtitle} onChange={v => updateField('rsvpQuestions.subtitle', v)} />
                  </Section>

                  {/* Footer */}
                  <Section title="Footer">
                    <Field label="Message" value={editingInvite.footer?.message} onChange={v => updateField('footer.message', v)} />
                    <Field label="Credit" value={editingInvite.footer?.credit} onChange={v => updateField('footer.credit', v)} />
                  </Section>

                  {/* Languages */}
                  <Section title="Languages">
                    <div className="flex flex-wrap gap-2">
                      {languages.map(lang => (
                        <label key={lang.code} className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors" style={{ backgroundColor: editingInvite.languages?.includes(lang.code) ? 'rgba(139,115,85,0.15)' : 'white', border: '1px solid rgba(139,115,85,0.15)' }}>
                          <input type="checkbox" checked={editingInvite.languages?.includes(lang.code) || false} onChange={e => {
                            const langs = [...(editingInvite.languages || [])];
                            if (e.target.checked) langs.push(lang.code);
                            else langs.splice(langs.indexOf(lang.code), 1);
                            updateField('languages', langs);
                          }} className="accent-[#8B7355]" />
                          <span className="text-sm" style={{ color: '#2c2417' }}>{lang.name}</span>
                        </label>
                      ))}
                    </div>
                  </Section>
                </div>
              )}
            </div>
          )}

          {/* DESIGNS TAB */}
          {activeTab === 'designs' && (
            <div>
              {/* New design form */}
              <div className="p-5 bg-white/60 rounded-lg mb-6" style={{ border: '1px solid rgba(139,115,85,0.1)' }}>
                <h3 className="text-sm font-bold mb-4" style={{ fontFamily: '"Cinzel", serif', color: '#2c2417' }}>Add New Design</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Name" value={newDesign.name} onChange={v => setNewDesign(p => ({ ...p, name: v }))} />
                  <Field label="Description" value={newDesign.description} onChange={v => setNewDesign(p => ({ ...p, description: v }))} />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <FileField label="Thumbnail" accept="image/*" onUpload={e => uploadDesignFile(e, 'thumbnail')} current={newDesign.thumbnail} />
                  <FileField label="Hero Background" accept="image/*" onUpload={e => uploadDesignFile(e, 'heroBackground')} current={newDesign.heroBackground} />
                  <FileField label="Opening Video" accept="video/*" onUpload={e => uploadDesignFile(e, 'openingVideo')} current={newDesign.openingVideo} />
                  <FileField label="Opening Poster" accept="image/*" onUpload={e => uploadDesignFile(e, 'openingPoster')} current={newDesign.openingPoster} />
                </div>
                <button onClick={saveDesign} disabled={!newDesign.name} className="mt-4 flex items-center gap-2 px-4 py-2 rounded text-xs tracking-wider uppercase" style={{ fontFamily: '"Cinzel", serif', backgroundColor: '#2c2417', color: '#f5f0e6', opacity: newDesign.name ? 1 : 0.5 }}>
                  <Plus size={14} />Create Design
                </button>
              </div>

              {/* Existing designs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {designs.map(d => (
                  <div key={d.id} className="p-4 bg-white/60 rounded-lg" style={{ border: '1px solid rgba(139,115,85,0.1)' }}>
                    {d.thumbnail && <img src={d.thumbnail} alt={d.name} className="w-full h-32 object-cover rounded mb-3" />}
                    <h4 className="text-sm font-bold" style={{ fontFamily: '"Cinzel", serif', color: '#2c2417' }}>{d.name}</h4>
                    <p className="text-xs mt-1 mb-3" style={{ color: '#8B7355' }}>{d.description}</p>
                    <button onClick={() => deleteDesign(d.id)} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"><Trash2 size={12} />Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RSVP TAB */}
          {activeTab === 'rsvp' && (
            <div>
              {rsvpList.length === 0 ? (
                <p className="text-center py-10 text-sm" style={{ color: '#8B7355' }}>No RSVP responses yet</p>
              ) : (
                <div className="space-y-3">
                  {rsvpList.map((r, i) => (
                    <div key={i} className="p-4 bg-white/60 rounded-lg" style={{ border: '1px solid rgba(139,115,85,0.1)' }}>
                      <div className="flex justify-between">
                        <span className="font-bold text-sm" style={{ color: '#2c2417' }}>{r.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${r.attending === 'yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{r.attending === 'yes' ? 'Attending' : 'Not Attending'}</span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: '#8B7355' }}>{r.email} • {r.guests} guest(s)</p>
                      {r.message && <p className="text-xs mt-2 italic" style={{ color: '#5c4f3a' }}>"{r.message}"</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* LANGUAGES TAB */}
          {activeTab === 'languages' && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {languages.map(lang => (
                  <div key={lang.code} className="p-4 bg-white/60 rounded-lg text-center" style={{ border: '1px solid rgba(139,115,85,0.1)' }}>
                    <span className="text-2xl">{lang.flag}</span>
                    <p className="font-bold text-sm mt-2" style={{ color: '#2c2417' }}>{lang.name}</p>
                    <p className="text-xs" style={{ color: '#8B7355' }}>{lang.code}{lang.rtl ? ' (RTL)' : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Reusable components
const Section = ({ title, children, action }) => (
  <div className="bg-white/50 rounded-lg p-5" style={{ border: '1px solid rgba(139,115,85,0.1)' }}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-bold" style={{ fontFamily: '"Cinzel", serif', color: '#2c2417' }}>{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

const Field = ({ label, value, onChange, type = 'text', textarea = false }) => (
  <div className="mb-3">
    {label && <label className="block text-[10px] tracking-widest uppercase mb-1.5 font-medium" style={{ fontFamily: '"Cinzel", serif', color: '#8B7355' }}>{label}</label>}
    {textarea ? (
      <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={3} className="w-full px-3 py-2.5 rounded border text-sm bg-white/60 focus:bg-white transition-colors resize-none" style={{ borderColor: 'rgba(139,115,85,0.2)', fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }} />
    ) : (
      <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2.5 rounded border text-sm bg-white/60 focus:bg-white transition-colors" style={{ borderColor: 'rgba(139,115,85,0.2)', fontFamily: '"Cormorant Garamond", serif', color: '#2c2417' }} />
    )}
  </div>
);

const FileField = ({ label, accept, onUpload, current, compact = false }) => (
  <div className={compact ? '' : 'mb-3'}>
    {label && <label className="block text-[10px] tracking-widest uppercase mb-1.5 font-medium" style={{ fontFamily: '"Cinzel", serif', color: '#8B7355' }}>{label}</label>}
    <label className="flex items-center gap-2 px-3 py-2 rounded border cursor-pointer hover:bg-white/40 transition-colors" style={{ borderColor: 'rgba(139,115,85,0.2)', borderStyle: 'dashed' }}>
      <Upload size={14} color="#8B7355" />
      <span className="text-xs" style={{ color: '#8B7355' }}>{current ? 'Replace file' : 'Upload file'}</span>
      <input type="file" accept={accept} onChange={onUpload} className="hidden" />
    </label>
  </div>
);

export default AdminDashboard;

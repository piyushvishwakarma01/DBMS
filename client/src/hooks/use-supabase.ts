"use client"
import { createClient, RealtimeChannel } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL as string
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY as string

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface UseSupabaseOptions {
  table: string
  column?: string
  value?: string
  event?: "INSERT" | "UPDATE" | "DELETE" | "*"
}

export const useSupabase = () => {
  return supabase
}

export const useRealtimeSubscription = <T>(
  options: UseSupabaseOptions,
  callback: (payload: T) => void
) => {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;
    
    const { table, column, value, event = '*' } = options;
    const schema = 'public'; // Declared schema variable

    // Create a channel
    const newChannel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event,
          schema,
          table,
          filter: column && value ? `${column}=eq.${value}` : undefined,
        },
        (payload) => {
          callback(payload.new as T);
        }
      )
      .subscribe();
    
    setChannel(newChannel);
    
    // Cleanup
    return () => {
      if (newChannel) {
        supabase.removeChannel(newChannel);
      }
    };
  }, [options.table, options.column, options.value, options.event, user, callback]);
  
  return channel;
};

// Example usage for notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = useSupabase();
  
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (error) throw error;
        
        setNotifications(data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, [user]);
  
  const handleNewNotification = useCallback((newNotification: any) => {
    setNotifications((prev) => [newNotification, ...prev]);
  }, [setNotifications]);

  // Subscribe to new notifications
  useRealtimeSubscription<any>(
    {
      table: 'notifications',
      column: 'user_id',
      value: user?.id,
      event: 'INSERT',
    },
    handleNewNotification
  );
  
  const markAsSeen = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ seen: true })
        .eq('id', notificationId);
      
      if (error) throw error;
      
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, seen: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as seen:', error);
    }
  };
  
  return {
    notifications,
    loading,
    markAsSeen,
  };
};

